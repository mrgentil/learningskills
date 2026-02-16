<?php

namespace App\Services;

use App\Models\Tenant;
use App\Models\User;
use App\Models\Plan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Exception;

class TenantCreationService
{
    /**
     * Create a new tenant for a user after a successful subscription.
     *
     * @param User $user
     * @param Plan $plan
     * @param array $data
     * @return Tenant
     * @throws Exception
     */
    public function createTenantForUser(User $user, Plan $plan, array $data = []): Tenant
    {
        return DB::transaction(function () use ($user, $plan, $data) {
            Log::info("Starting tenant creation for user: {$user->email}, plan: {$plan->slug}");

            // 1. Generate Unique Slug
            $baseSlug = Str::slug($data['academy_name'] ?? $user->name . "'s Academy");
            $slug = $this->generateUniqueSlug($baseSlug);

            // 2. Create Tenant
            $tenant = Tenant::create([
                'owner_id' => $user->id,
                'plan_id' => $plan->id,
                'name' => $data['academy_name'] ?? $user->name . "'s Academy",
                'slug' => $slug,
                'is_active' => true,
                'data' => [
                    'theme' => 'default',
                    'accent_color' => '#ff007a',
                ],
            ]);

            if (!$tenant) {
                throw new Exception("Erreur lors de la création de l'académie.");
            }

            // 3. Assign Owner Role in Pivot Table
            $user->tenants()->attach($tenant->id, [
                'role' => 'owner',
                'status' => 'active',
                'joined_at' => now(),
            ]);

            // Verify attachment
            if (!$user->tenants()->where('tenants.id', $tenant->id)->exists()) {
                throw new Exception("Erreur lors de l'assignation du rôle propriétaire.");
            }

            Log::info("Tenant created successfully: ID {$tenant->id}, Slug {$slug}");

            return $tenant;
        });
    }

    /**
     * Generate a unique slug with recursive collision handling.
     *
     * @param string $slug
     * @param int $counter
     * @return string
     */
    private function generateUniqueSlug(string $slug, int $counter = 0): string
    {
        $currentSlug = $counter > 0 ? "{$slug}-{$counter}" : $slug;

        if (Tenant::where('slug', $currentSlug)->exists()) {
            return $this->generateUniqueSlug($slug, $counter + 1);
        }

        return $currentSlug;
    }
}
