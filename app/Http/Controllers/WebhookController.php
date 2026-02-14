<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Plan;
use App\Models\Tenant;
use App\Services\TenantCreationService;
use Laravel\Cashier\Http\Controllers\WebhookController as CashierController;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class WebhookController extends CashierController
{
    /**
     * Handle a Stripe "checkout.session.completed" event.
     *
     * @param  array  $payload
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handleCheckoutSessionCompleted(array $payload)
    {
        $session = $payload['data']['object'];
        $userId = $session['metadata']['user_id'] ?? null;
        $planId = $session['metadata']['plan_id'] ?? null;

        Log::info("Webhook received: checkout.session.completed", [
            'session_id' => $session['id'],
            'user_id' => $userId,
            'plan_id' => $planId,
        ]);

        if (!$userId || !$planId) {
            Log::error("Missing metadata in Stripe Session: {$session['id']}");
            return $this->successMethod();
        }

        try {
            $user = User::findOrFail($userId);
            $plan = Plan::findOrFail($planId);

            // 1. Idempotency Check: Does this user already have a tenant?
            // (Adjust this logic if users can have multiple tenants/academies)
            if ($user->ownedTenants()->exists()) {
                Log::warning("Tenant already exists for user {$userId}. Skipping creation.");
                return $this->successMethod();
            }

            // 2. Double Check Subscription Status via Cashier
            // We use the ID to ensure we're looking at the right object even if session is stale
            if (!$user->subscribed('default')) {
                Log::error("User {$userId} is NOT subscribed despite session completion.");
                // Note: Stripe might delay subscription creation slightly, but checkout.session.completed
                // usually means it's done. Cashier handles the 'default' name.
            }

            // 3. Create Tenant via Service
            $service = app(TenantCreationService::class);
            $service->createTenantForUser($user, $plan, [
                'academy_name' => $user->name . "'s Academy", 
                // Metadata could also include a custom academy name if collected in checkout
            ]);

            Log::info("Webhook processed successfully for Session: {$session['id']}");

        } catch (\Exception $e) {
            Log::error("Webhook processing failed: " . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            // Return a success method even if it fails here to prevent Stripe from retrying 
            // infinitely if the error is unrecoverable, OR return an error to let it retry.
            // Usually, for idempotency logic, we want a retry if it's a DB failure.
            return response()->json(['error' => 'Webhook handler failed'], 500);
        }

        return $this->successMethod();
    }
}
