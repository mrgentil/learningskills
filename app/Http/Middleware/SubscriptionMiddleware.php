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

        // Super admins always pass through
        if ($user->is_super_admin) {
            return $next($request);
        }

        // Helper: return JSON or redirect depending on request type
        $denyAccess = function (string $message, int $status = 403) use ($request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json(['error' => $message], $status);
            }
            return redirect(url('/') . '#cbx-pricing')->with('error', $message);
        };

        // 1. Resolve Tenant (Initialization logic)
        $tenantId = session('tenant_id');
        $tenant = null;

        if ($tenantId) {
            // Verify user belongs to this tenant
            $isOwner = $user->ownedTenants()->where('id', $tenantId)->exists();
            $isMember = $user->tenants()->where('tenants.id', $tenantId)->exists();

            if ($isOwner || $isMember) {
                $tenant = Tenant::find($tenantId);
            } else {
                session()->forget('tenant_id');
                $tenantId = null;
            }
        }

        if (!$tenant) {
            // Priority: owned > member
            $tenant = $user->ownedTenants()->first() ?? $user->tenants()->first();
            
            if (!$tenant) {
                return $denyAccess('Aucune académie trouvée. Veuillez choisir un plan.', 404);
            }

            session(['tenant_id' => $tenant->id]);
        }

        // 2. Resolve Role for this Tenant
        $tenantUser = \DB::table('tenant_user')
            ->where('tenant_id', $tenant->id)
            ->where('user_id', $user->id)
            ->first();

        $isStudent = $tenantUser && $tenantUser->role === 'student';

        // 3. Check Tenant status
        if (!$tenant->is_active) {
            return $denyAccess('Cette académie est actuellement inactive.');
        }

        // 4. Check Subscription status (ONLY for Academy Owners/Admins)
        // NOTE: We allow the Owner to access their dashboard even if they haven't paid yet
        // so they can configure their academy, pick a plan, etc.
        // QuotaService will handle restricting actual course creation/enrollment.
        if (!$isStudent) {
            $owner = $tenant->owner;
            $isActualOwner = $owner && $owner->id === $user->id;

            if (!$isActualOwner) {
                // If they are an "admin" or "instructor" but NOT the owner, 
                // they strictly need an active subscription/license for the tenant.
                $requiresSubscription = $tenant->plan && $tenant->plan->price > 0;

                if ($requiresSubscription) {
                    $hasActiveLicense = $tenant->activeLicense()->exists();
                    $hasStripeSubscription = $owner && $owner->subscribed('default');

                    if (!$hasActiveLicense && !$hasStripeSubscription) {
                        return $denyAccess('Un abonnement actif est requis pour accéder au dashboard.');
                    }
                }
            }
        }

        return $next($request);
    }
}
