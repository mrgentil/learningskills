<?php

namespace App\Http\Controllers;

use App\Services\QuotaService;
use Illuminate\Support\Facades\Auth;

class QuotaController extends Controller
{
    /**
     * Usage et limites du plan (cours, étudiants) pour l'académie courante.
     */
    public function index()
    {
        $user = Auth::user();
        $tenant = $user->ownedTenants()->first() ?? $user->tenants()->first();

        if (!$tenant) {
            return response()->json(['quota' => null]);
        }

        $tenant->load('plan');
        $quota = app(QuotaService::class)->getUsage($tenant);

        return response()->json([
            'quota' => $quota,
            'can_create_course' => app(QuotaService::class)->canCreateCourse($tenant),
        ]);
    }
}
