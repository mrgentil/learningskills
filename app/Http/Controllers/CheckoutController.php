<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Services\TenantCreationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CheckoutController extends Controller
{
    /**
     * Show the checkout page for a specific plan.
     *
     * @param string $planSlug
     * @return \Illuminate\View\View
     */
    public function createSession(string $planSlug)
    {
        $plan = Plan::where('slug', $planSlug)->where('is_active', true)->firstOrFail();

        return view('checkout', compact('plan'));
    }

    /**
     * Process the mock checkout and create a tenant.
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function processCheckout(Request $request)
    {
        $request->validate([
            'plan_slug' => 'required|string|exists:plans,slug',
            'card_name' => 'required|string|max:255',
            'card_number' => 'required|string',
            'card_expiry' => 'required|string',
            'card_cvc' => 'required|string',
            'academy_name' => 'required|string|max:255',
        ]);

        $user = Auth::user();
        $plan = Plan::where('slug', $request->plan_slug)->where('is_active', true)->firstOrFail();

        // Check if user already has a tenant
        if ($user->ownedTenants()->exists()) {
            return redirect()->route('dashboard')->with('info', 'Vous possédez déjà une académie active.');
        }

        try {
            // Create Tenant via Service (bypasses Stripe)
            $service = app(TenantCreationService::class);
            $tenant = $service->createTenantForUser($user, $plan, [
                'academy_name' => $request->academy_name,
            ]);

            Log::info("Mock checkout completed for user {$user->id}, tenant created: {$tenant->id}");

            return redirect()->route('dashboard')->with('success', 'Votre académie a été créée avec succès !');

        } catch (\Exception $e) {
            Log::error("Mock checkout failed: " . $e->getMessage());
            return back()->with('error', 'Une erreur est survenue lors de la création de votre académie. Veuillez réessayer.');
        }
    }
}
