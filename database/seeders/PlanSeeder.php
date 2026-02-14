<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Plan;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Starter',
                'slug' => 'starter',
                'stripe_plan_id' => 'price_starter_monthly', // Placeholder
                'price' => 0.00,
                'interval' => 'month',
                'description' => 'Idéal pour démarrer votre première académie en ligne.',
                'max_courses' => 5,
                'max_students' => 50,
                'features' => [
                    'Jusqu\'à 5 cours',
                    '50 étudiants maximum',
                    'Support par email standard',
                    'Paiements sécurisés Stripe',
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Pro',
                'slug' => 'pro',
                'stripe_plan_id' => 'price_pro_monthly', // Placeholder
                'price' => 29.00,
                'interval' => 'month',
                'description' => 'Pour les formateurs sérieux qui veulent développer leur activité.',
                'max_courses' => 20,
                'max_students' => 500,
                'features' => [
                    'Jusqu\'à 20 cours',
                    '500 étudiants',
                    'Certificats de réussite',
                    'Support prioritaire',
                    'Analytiques avancées',
                    'Sans commission de plateforme',
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Business',
                'slug' => 'business',
                'stripe_plan_id' => 'price_business_monthly', // Placeholder
                'price' => 99.00,
                'interval' => 'month',
                'description' => 'La solution complète pour les organismes de formation et entreprises.',
                'max_courses' => 0, // Illimité
                'max_students' => 0, // Illimité
                'features' => [
                    'Cours illimités',
                    'Étudiants illimités',
                    'Domaine personnalisé (votre-ecole.com)',
                    'Marque blanche totale',
                    'API & Webhooks',
                    'Support dédié 24/7',
                    'Migration de données incluse',
                ],
                'is_active' => true,
            ],
        ];

        foreach ($plans as $plan) {
            Plan::updateOrCreate(
                ['slug' => $plan['slug']],
                $plan
            );
        }
    }
}
