<?php

namespace App\Console\Commands;

use App\Models\Course;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Console\Command;

class DiagnoseDashboard extends Command
{
    protected $signature = 'dashboard:diagnose {email? : Email de l\'utilisateur à diagnostiquer}';
    protected $description = 'Diagnostique pourquoi les cours et paramètres ne s\'affichent pas dans le dashboard';

    public function handle(): int
    {
        $email = $this->argument('email');
        
        if ($email) {
            $user = User::where('email', $email)->first();
            if (!$user) {
                $this->error("Utilisateur avec l'email '{$email}' introuvable.");
                return 1;
            }
            $this->diagnoseUser($user);
        } else {
            $this->info('=== DIAGNOSTIC GLOBAL ===');
            $this->newLine();
            
            $tenants = Tenant::with('owner')->get();
            $this->info("Tenants (académies) : {$tenants->count()}");
            foreach ($tenants as $t) {
                $coursesCount = Course::where('tenant_id', $t->id)->count();
                $ownerEmail = $t->owner?->email ?? 'N/A';
                $this->line("  - ID:{$t->id} | Slug: {$t->slug} | Owner: {$ownerEmail} | Cours: {$coursesCount}");
            }
            
            $this->newLine();
            $coursesTotal = Course::withTrashed()->count();
            $coursesActive = Course::count();
            $this->info("Total cours en base : {$coursesActive} (incl. supprimés: {$coursesTotal})");
            
            $this->newLine();
            $this->info('Pour diagnostiquer un utilisateur spécifique :');
            $this->line('  php artisan dashboard:diagnose email@exemple.com');
        }

        return 0;
    }

    private function diagnoseUser(User $user): void
    {
        $this->info("=== DIAGNOSTIC pour {$user->email} (ID: {$user->id}) ===");
        $this->newLine();

        // 1. Tenant owned
        $ownedTenants = $user->ownedTenants()->get();
        $this->info("1. Académies dont vous êtes propriétaire : " . $ownedTenants->count());
        foreach ($ownedTenants as $t) {
            $coursesCount = Course::where('tenant_id', $t->id)->count();
            $this->line("   - {$t->name} (slug: {$t->slug}) - {$coursesCount} cours");
        }

        // 2. Tenant membership
        $tenantMemberships = $user->tenants()->get();
        $this->newLine();
        $this->info("2. Académies où vous êtes membre (tenant_user) : " . $tenantMemberships->count());
        foreach ($tenantMemberships as $t) {
            $role = $t->pivot->role ?? '?';
            $coursesCount = Course::where('tenant_id', $t->id)->count();
            $this->line("   - {$t->name} (rôle: {$role}) - {$coursesCount} cours");
        }

        // 3. Tenant used by APIs
        $tenant = $user->ownedTenants()->first() ?? $user->tenants()->first();
        $this->newLine();
        if ($tenant) {
            $this->info("3. Tenant utilisé par les APIs : {$tenant->name} (ID: {$tenant->id})");
            $courses = Course::where('tenant_id', $tenant->id)->get();
            $this->line("   Cours visibles : {$courses->count()}");
            foreach ($courses->take(5) as $c) {
                $this->line("     - [{$c->id}] {$c->title} (status: {$c->status})");
            }
            if ($courses->count() > 5) {
                $this->line("     ... et " . ($courses->count() - 5) . " autres");
            }
        } else {
            $this->error("3. PROBLÈME : Aucun tenant associé à cet utilisateur !");
            $this->line("   Les APIs /api/academy/courses et /api/academy/settings retournent 404.");
            $this->line("   → Vous devez créer une académie (checkout) ou être invité dans une académie existante.");
        }

        // 4. Courses with wrong tenant?
        $allCourses = Course::all();
        $orphanCourses = $allCourses->filter(fn ($c) => !Tenant::find($c->tenant_id));
        if ($orphanCourses->isNotEmpty()) {
            $this->newLine();
            $this->warn("4. Cours orphelins (tenant_id inexistant) : " . $orphanCourses->count());
        }

        $this->newLine();
        $this->info('=== RÉSUMÉ ===');
        if (!$tenant) {
            $this->error('L\'utilisateur n\'a pas d\'académie. Créez-en une via le checkout ou liez-le à un tenant.');
        } elseif ($tenant && Course::where('tenant_id', $tenant->id)->count() === 0) {
            $this->warn("L'utilisateur a une académie mais aucun cours n'y est associé.");
            $this->line("Vérifiez que les cours en base ont bien tenant_id = {$tenant->id}");
        } else {
            $this->info('Configuration OK. Si le dashboard ne montre rien, vérifiez la session et l\'abonnement Stripe.');
        }
    }
}
