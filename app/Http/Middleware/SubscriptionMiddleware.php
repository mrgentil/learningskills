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
        // If no tenant in session, pick the first one this user owns or belongs to
        if (!session()->has('tenant_id')) {
            $tenant = $user->ownedTenants()->first() ?? $user->tenants()->first();
            
            if (!$tenant) {
                // User has no tenant/academy — redirect to pricing to subscribe
                return redirect(url('/') . '#cbx-pricing');
            }

            session(['tenant_id' => $tenant->id]);
        }

        $tenant = Tenant::findOrFail(session('tenant_id'));

        // 2. Check Tenant status
        if (!$tenant->is_active) {
            return redirect()->route('home')->with('error', 'Votre académie est actuellement inactive.');
        }

        // 3. Check Subscription status
        // We check the owner of the tenant
        $owner = $tenant->owner;

        // Cashier check: if the owner is NOT subscribed, redirect to payment
        // We assume 'default' subscription name
        if (!$owner->subscribed('default')) {
            // Note: In a real app, you might want to allow some grace period or a free plan check.
            // If the plan is "free" (price = 0), we might skip this.
            if ($tenant->plan && $tenant->plan->price > 0) {
                 return redirect()->route('home')->with('error', 'Un abonnement actif est requis pour accéder au dashboard.');
            }
        }

        return $next($request);
    }
}
