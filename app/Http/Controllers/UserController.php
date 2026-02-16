<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Get the authenticated user's details and role.
     */
    public function me()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        if ($user->is_super_admin) {
            return response()->json([
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => 'super_admin',
            ]);
        }

        // For now, we take the role from the first tenant relationship
        $tenantUser = $user->tenants()->first();
        $role = $tenantUser ? $tenantUser->pivot->role : 'student';

        // Override if they own at least one tenant but aren't in pivot
        $ownedTenant = $user->ownedTenants()->first();
        if ($ownedTenant) {
            $role = 'owner';
        }

        $academySlug = $ownedTenant ? $ownedTenant->slug : ($tenantUser ? $tenantUser->slug : null);

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $role,
            'academy_slug' => $academySlug,
        ]);
    }
}
