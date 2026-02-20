<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
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
     * List all platform users with role, tenant, and enrollment info.
     */
    public function index()
    {
        $users = User::query()
            ->select([
                'users.id',
                'users.name',
                'users.email',
                'users.is_super_admin',
                'users.created_at',
            ])
            ->withCount('enrollments')
            ->orderByDesc('users.created_at')
            ->paginate(20);

        $users->getCollection()->transform(function ($u) {
            // Determine role and tenant
            if ($u->is_super_admin) {
                $role = 'super_admin';
                $tenantName = '— Plateforme —';
            } else {
                $owned = $u->ownedTenants()->first();
                if ($owned) {
                    $role = 'owner';
                    $tenantName = $owned->name;
                } else {
                    $member = $u->tenants()->first();
                    if ($member) {
                        $role = $member->pivot->role;
                        $tenantName = $member->name;
                    } else {
                        $role = 'sans_académie';
                        $tenantName = '—';
                    }
                }
            }

            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $role,
                'tenant_name' => $tenantName,
                'enrollments_count' => $u->enrollments_count,
                'created_at' => $u->created_at?->toIso8601String(),
            ];
        });

        return response()->json($users);
    }

    /**
     * Show a single user profile.
     */
    public function show($id)
    {
        $user = User::findOrFail($id);

        $owned = $user->ownedTenants()->first();
        $member = $user->tenants()->first();

        $role = 'student';
        $tenantName = '—';
        if ($user->is_super_admin) {
            $role = 'super_admin';
            $tenantName = '— Plateforme —';
        } elseif ($owned) {
            $role = 'owner';
            $tenantName = $owned->name;
        } elseif ($member) {
            $role = $member->pivot->role;
            $tenantName = $member->name;
        }

        $enrollments = $user->enrollments()
            ->with('course:id,title,slug,thumbnail')
            ->orderByDesc('enrolled_at')
            ->get()
            ->map(fn ($e) => [
                'course_title' => $e->course?->title,
                'progress_percent' => $e->progress_percent ?? 0,
                'status' => $e->status,
                'enrolled_at' => $e->enrolled_at?->toIso8601String(),
            ]);

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $role,
            'tenant_name' => $tenantName,
            'enrollments' => $enrollments,
            'created_at' => $user->created_at?->toIso8601String(),
        ]);
    }
}
