<?php

namespace Database\Seeders;

use App\Models\Plan;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create a Default Pro Plan
        $plan = Plan::updateOrCreate(
            ['slug' => 'pro-plan'],
            [
                'name' => 'Pro Plan',
                'stripe_plan_id' => 'price_pro_default',
                'price' => 14900, // $149.00
                'interval' => 'month',
                'description' => 'Unlimited Students & 30 Courses',
                'max_courses' => 30,
                'max_students' => 0, // unlimited
                'features' => ['Priority Support', 'Advanced Analytics', 'Custom Branded'],
                'is_active' => true,
            ]
        );

        // 2. Create the Super Admin User
        $user = User::updateOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'), // Change this in production
                'is_super_admin' => true,
                'email_verified_at' => now(),
            ]
        );

        // 3. Create the Main Academy (Tenant)
        $tenant = Tenant::updateOrCreate(
            ['slug' => 'main-academy'],
            [
                'owner_id' => $user->id,
                'plan_id' => $plan->id,
                'name' => 'Main Academy',
                'is_active' => true,
                'data' => [
                    'theme' => 'default',
                    'accent_color' => '#ff007a'
                ]
            ]
        );

        // 4. Attach User to Tenant with 'owner' role
        // Using syncWithoutDetaching to avoid duplicate entries
        $user->tenants()->syncWithoutDetaching([
            $tenant->id => [
                'role' => 'owner',
                'status' => 'active',
                'joined_at' => now(),
            ]
        ]);

        $this->command->info('Super Admin created successfully!');
        $this->command->info('Email: admin@admin.com');
        $this->command->info('Password: password');
    }
}
