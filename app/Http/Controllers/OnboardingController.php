<?php

namespace App\Http\Controllers;

use App\Models\OnboardingRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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

    private function authorizeAdmin()
    {
        if (!auth()->user() || !auth()->user()->is_super_admin) {
            abort(403, 'Unauthorized');
        }
    }
}
