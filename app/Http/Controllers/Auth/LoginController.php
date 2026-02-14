<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use App\Models\Tenant;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/dashboard';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
        $this->middleware('auth')->only('logout');
    }

    /**
     * The user has been authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  mixed  $user
     * @return mixed
     */
    protected function authenticated(Request $request, $user)
    {
        if ($request->filled('academy_slug')) {
            $tenant = Tenant::where('slug', $request->academy_slug)->first();
            if ($tenant) {
                // Set the session so SubscriptionMiddleware doesn't redirect to pricing
                session(['tenant_id' => $tenant->id]);
                
                // Redirect to the academy home or student dashboard
                return redirect()->route('academy.show', $tenant->slug);
            }
        }

        // Default behavior
        return redirect()->intended($this->redirectTo);
    }

    /**
     * Show the application's login form.
     * Overridden to support branding.
     *
     * @return \Illuminate\View\View
     */
    public function showLoginForm(Request $request)
    {
        $tenant = null;
        if ($request->has('academy')) {
            $tenant = Tenant::where('slug', $request->academy)->first();
        }
        return view('auth.login', compact('tenant'));
    }
}
