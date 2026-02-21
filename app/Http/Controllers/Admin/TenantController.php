<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\TenantLicense;
use App\Models\Plan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class TenantController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if (!auth()->user() || !auth()->user()->is_super_admin) {
                abort(403, 'Unauthorized action.');
            }
            return $next($request);
        });
    }

    /**
     * List all tenants with owner, plan, stats & license info.
     */
    public function index()
    {
        $tenants = Tenant::with(['owner:id,name,email', 'plan:id,name,price,tier,pricing_type'])
            ->withCount(['courses', 'users'])
            ->orderByDesc('created_at')
            ->paginate(10);

        $tenants->getCollection()->transform(function ($t) {
            $activeLicense = $t->activeLicense()->first();

            return [
                'id' => $t->id,
                'name' => $t->name,
                'slug' => $t->slug,
                'owner_name' => $t->owner?->name ?? '—',
                'owner_email' => $t->owner?->email ?? '—',
                'plan_name' => $t->plan?->name ?? 'Aucun',
                'plan_tier' => $t->plan?->tier ?? null,
                'plan_price' => $t->plan?->price ?? 0,
                'courses_count' => $t->courses_count,
                'students_count' => $t->users_count,
                'is_active' => $t->is_active,
                'total_revenue' => $t->total_revenue ?? 0,
                'license_status' => $activeLicense ? 'active' : 'none',
                'license_expires' => $activeLicense ? ($activeLicense->expires_at ? $activeLicense->expires_at->toDateString() : 'À vie') : null,
                'created_at' => $t->created_at?->toIso8601String(),
            ];
        });

        return response()->json($tenants);
    }

    /**
     * Create a new academy (admin-driven deployment).
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:tenants,slug',
            'plan_id' => 'required|exists:plans,id',
            'owner_email' => 'required|email|max:255',
            'owner_name' => 'required|string|max:255',
            'notes' => 'nullable|string',
            'license_duration_months' => 'nullable|integer|min:1|max:120',
        ]);

        return DB::transaction(function () use ($data) {
            // 1. Find or create the owner user
            $user = User::where('email', $data['owner_email'])->first();
            if (!$user) {
                $user = User::create([
                    'name' => $data['owner_name'],
                    'email' => $data['owner_email'],
                    'password' => Hash::make('password'), // Temporary — owner should reset
                ]);
            }

            // 2. Create the tenant
            $tenant = Tenant::create([
                'owner_id' => $user->id,
                'plan_id' => $data['plan_id'],
                'name' => $data['name'],
                'slug' => $data['slug'],
                'is_active' => true,
            ]);

            // 3. Attach owner to pivot with role 'owner'
            $tenant->users()->attach($user->id, [
                'role' => 'owner',
                'status' => 'active',
                'joined_at' => now(),
            ]);

            // 4. Create the initial license
            $plan = Plan::find($data['plan_id']);
            $durationMonths = $data['license_duration_months'] ?? 12;

            TenantLicense::create([
                'tenant_id' => $tenant->id,
                'name' => "Licence {$plan->name} — {$tenant->name}",
                'starts_at' => now(),
                'expires_at' => null, // Lifetime
                'maintenance_included' => true,
                'rights' => $plan->features ?? [],
                'status' => 'active',
                'notes' => $data['notes'] ?? null,
            ]);

            return response()->json([
                'message' => 'Académie créée avec succès.',
                'tenant' => $tenant->load('owner', 'plan'),
                'temporary_password' => $user->wasRecentlyCreated ? 'password' : null,
            ], 201);
        });
    }

    /**
     * Show a single tenant.
     */
    public function show(Tenant $tenant)
    {
        $tenant->load(['owner:id,name,email', 'plan:id,name,price,tier']);
        $tenant->loadCount(['courses', 'users']);

        return response()->json([
            'id' => $tenant->id,
            'name' => $tenant->name,
            'slug' => $tenant->slug,
            'owner_name' => $tenant->owner?->name,
            'owner_email' => $tenant->owner?->email,
            'plan_name' => $tenant->plan?->name ?? 'Aucun',
            'courses_count' => $tenant->courses_count,
            'students_count' => $tenant->users_count,
            'is_active' => $tenant->is_active,
            'total_revenue' => $tenant->total_revenue ?? 0,
            'created_at' => $tenant->created_at?->toIso8601String(),
        ]);
    }

    /**
     * Toggle active/inactive status or update plan.
     */
    public function update(Request $request, Tenant $tenant)
    {
        $data = $request->validate([
            'is_active' => 'sometimes|boolean',
            'plan_id' => 'sometimes|nullable|exists:plans,id',
        ]);

        $tenant->update($data);
        return response()->json($tenant->fresh());
    }
}
