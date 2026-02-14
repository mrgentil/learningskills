<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Tenant;

class SubscriptionMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return $next($request);
        }

        // 1. Resolve Tenant (Initialization logic)
        if (!session()->has('tenant_id')) {
            // Priority: session > owned > member
            $tenant = $user->ownedTenants()->first() ?? $user->tenants()->first();
            
            if (!$tenant) {
                // User has no tenant/academy — they are truly a new platform user
                // Only redirect to pricing if they aren't on a public academy page (handled by different routes anyway)
                return redirect(url('/') . '#cbx-pricing');
            }

            session(['tenant_id' => $tenant->id]);
        }

        $tenant = Tenant::findOrFail(session('tenant_id'));

        // 2. Check Role: If the user is just a student, they DON'T need a platform subscription
        $tenantUser = \DB::table('tenant_user')
            ->where('tenant_id', $tenant->id)
            ->where('user_id', $user->id)
            ->first();

        $isStudent = $tenantUser && $tenantUser->role === 'student';

        // 3. Check Tenant status
        if (!$tenant->is_active) {
            return redirect()->route('home')->with('error', 'Cette académie est actuellement inactive.');
        }

        // 4. Check Subscription status (ONLY for Academy Owners/Admins)
        if (!$isStudent) {
            $owner = $tenant->owner;
            if (!$owner->subscribed('default')) {
                if ($tenant->plan && $tenant->plan->price > 0) {
                     return redirect()->route('home')->with('error', 'Un abonnement actif est requis pour accéder au dashboard.');
                }
            }
        }

        return $next($request);
    }
}
