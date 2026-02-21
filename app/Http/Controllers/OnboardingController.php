<?php

namespace App\Http\Controllers;

use App\Models\OnboardingRequest;
use App\Models\Tenant;
use App\Models\User;
use App\Models\Plan;
use App\Models\TenantLicense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OnboardingController extends Controller
{
    /**
     * Store a new onboarding request from the public form.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'organization_name' => 'required|string|max:255',
            'contact_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:255',
            'timezone' => 'nullable|string|max:255',
            'academy_name' => 'required|string|max:255',
            'custom_domain' => 'required|boolean',
            'domain_name' => 'nullable|string|max:255',
            'training_types' => 'nullable|array',
            'content_types' => 'nullable|array',
            'wants_certificates' => 'required|boolean',
            'estimated_learners' => 'nullable|string|max:255',
            'registration_mode' => 'nullable|string|max:255',
            'will_sell_courses' => 'required|boolean',
            'has_stripe' => 'required|boolean',
            'enabled_features' => 'nullable|array',
            'content_readiness' => 'nullable|string|max:255',
            'target_launch_date' => 'nullable|date',
            'comments' => 'nullable|string',
            'selected_plan' => 'required|string|in:starter,pro,enterprise',
            'payment_method' => 'nullable|string|max:255',
            // Image handling (logo) can be added here if sending as base64 or file
        ]);

        // Handle base64 logo if provided
        if ($request->has('logo_base64')) {
            $imageData = $request->input('logo_base64');
            if (preg_match('/^data:image\/(\w+);base64,/', $imageData, $type)) {
                $imageData = substr($imageData, strpos($imageData, ',') + 1);
                $type = strtolower($type[1]); // jpg, png, gif

                if (in_array($type, ['jpg', 'jpeg', 'gif', 'png'])) {
                    $imageData = base64_decode($imageData);
                    $fileName = 'logo_' . time() . '.' . $type;
                    $path = 'onboarding_logos/' . $fileName;
                    Storage::disk('public')->put($path, $imageData);
                    $validated['logo_path'] = $path;
                }
            }
        }

        $onboardingRequest = OnboardingRequest::create($validated);

        return response()->json([
            'message' => 'Votre demande a été enregistrée avec succès. Nous vous contacterons sous peu.',
            'id' => $onboardingRequest->id
        ], 201);
    }

    /**
     * Admin: List all onboarding requests.
     */
    public function index()
    {
        $this->authorizeAdmin();

        $requests = OnboardingRequest::orderBy('created_at', 'desc')->paginate(20);
        return response()->json($requests);
    }

    /**
     * Admin: Get a single request details.
     */
    public function show($id)
    {
        $this->authorizeAdmin();

        $request = OnboardingRequest::findOrFail($id);
        return response()->json($request);
    }

    /**
     * Admin: Update request status.
     */
    public function updateStatus(Request $request, $id)
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'status' => 'required|in:new,contacted,deployed,archived',
        ]);

        $onboardingRequest = OnboardingRequest::findOrFail($id);
        $onboardingRequest->update($validated);

        return response()->json($onboardingRequest);
    }

    /**
     * Admin: Deploy an academy from an onboarding request.
     */
    public function deploy(Request $request, $id)
    {
        $this->authorizeAdmin();

        $onboardingRequest = OnboardingRequest::findOrFail($id);

        if ($onboardingRequest->status === 'deployed') {
            return response()->json(['message' => 'Cette académie a déjà été déployée.'], 422);
        }

        return DB::transaction(function () use ($onboardingRequest) {
            // 1. Find or create the owner user
            $user = User::where('email', $onboardingRequest->email)->first();
            if (!$user) {
                $user = User::create([
                    'name' => $onboardingRequest->contact_name,
                    'email' => $onboardingRequest->email,
                    'password' => Hash::make('password'), // Client must reset
                ]);
            }

            // 2. Resolve Plan
            // Mapping onboarding plan names (starter, pro, enterprise) to potential tiers or names in the plans table
            $plan = Plan::where('tier', $onboardingRequest->selected_plan)
                ->orWhere('name', 'like', '%' . $onboardingRequest->selected_plan . '%')
                ->first();

            if (!$plan) {
                // Fallback to first plan if none matches (should be handled better in production)
                $plan = Plan::first();
            }

            // 3. Create the tenant
            $slug = Str::slug($onboardingRequest->academy_name);
            
            // Ensure unique slug
            $baseSlug = $slug;
            $counter = 1;
            while (Tenant::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }

            $tenant = Tenant::create([
                'owner_id' => $user->id,
                'plan_id' => $plan ? $plan->id : null,
                'name' => $onboardingRequest->academy_name,
                'slug' => $slug,
                'custom_domain' => $onboardingRequest->domain_name,
                'is_active' => true,
                'data' => [
                    'onboarding_id' => $onboardingRequest->id,
                    'organization' => $onboardingRequest->organization_name,
                    'phone' => $onboardingRequest->phone,
                ]
            ]);

            // 4. Attach owner to pivot
            $tenant->users()->attach($user->id, [
                'role' => 'owner',
                'status' => 'active',
                'joined_at' => now(),
            ]);

            // 5. Create the initial license (12 months)
            if ($plan) {
                TenantLicense::create([
                    'tenant_id' => $tenant->id,
                    'name' => "Licence {$plan->name} — {$tenant->name}",
                    'starts_at' => now(),
                    'expires_at' => now()->addMonths(12),
                    'maintenance_included' => true,
                    'rights' => $plan->features ?? [],
                    'status' => 'active',
                ]);
            }

            // 6. Update onboarding request status
            $onboardingRequest->update(['status' => 'deployed']);

            return response()->json([
                'message' => 'Académie déployée avec succès.',
                'tenant_url' => url("/academy/{$tenant->slug}"),
                'credentials' => [
                    'email' => $user->email,
                    'password' => $user->wasRecentlyCreated ? 'password' : '(Existant)',
                ]
            ]);
        });
    }

    private function authorizeAdmin()
    {
        if (!auth()->user() || !auth()->user()->is_super_admin) {
            abort(403, 'Unauthorized');
        }
    }
}
