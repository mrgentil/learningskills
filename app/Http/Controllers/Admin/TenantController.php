<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Http\Request;

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
     * List all tenants with owner, plan, stats.
     */
    public function index()
    {
        $tenants = Tenant::with(['owner:id,name,email', 'plan:id,name,price'])
            ->withCount(['courses', 'users'])
            ->orderByDesc('created_at')
            ->paginate(10);

        $tenants->getCollection()->transform(function ($t) {
            return [
                'id' => $t->id,
                'name' => $t->name,
                'slug' => $t->slug,
                'owner_name' => $t->owner?->name ?? '—',
                'owner_email' => $t->owner?->email ?? '—',
                'plan_name' => $t->plan?->name ?? 'Aucun',
                'plan_price' => $t->plan?->price ?? 0,
                'courses_count' => $t->courses_count,
                'students_count' => $t->users_count,
                'is_active' => $t->is_active,
                'total_revenue' => $t->total_revenue ?? 0,
                'created_at' => $t->created_at?->toIso8601String(),
            ];
        });

        return response()->json($tenants);
    }

    /**
     * Show a single tenant.
     */
    public function show(Tenant $tenant)
    {
        $tenant->load(['owner:id,name,email', 'plan:id,name,price']);
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
     * Toggle active/inactive status.
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
