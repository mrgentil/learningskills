<?php

namespace App\Console\Commands;

use App\Models\Certificate;
use App\Models\Enrollment;
use Illuminate\Console\Command;

class SyncCertificatesCommand extends Command
{
    protected $signature = 'certificates:sync {--user= : ID utilisateur (optionnel, sinon tous)}';
    protected $description = 'Diagnostique et crée les certificats manquants pour les cours terminés à 100%';

    public function handle(): int
    {
        $userId = $this->option('user');

        $query = Enrollment::withoutGlobalScopes()
            ->where('progress_percent', '>=', 99.9)
            ->whereDoesntHave('certificate')
            ->with(['user', 'course']);

        if ($userId) {
            $query->where('user_id', $userId);
        }

        $enrollments = $query->get();

        if ($enrollments->isEmpty()) {
            $this->info('Aucun certificat manquant trouvé.');
            $this->checkExisting();
            return 0;
        }

        $this->info("→ {$enrollments->count()} certificat(s) à créer.\n");

        foreach ($enrollments as $e) {
            Certificate::create([
                'tenant_id' => $e->tenant_id,
                'enrollment_id' => $e->id,
                'certificate_uuid' => \Illuminate\Support\Str::uuid(),
                'issued_at' => $e->completed_at ?? now(),
            ]);
            $this->line("  ✓ {$e->user->name} (#{$e->user_id}) – {$e->course->title}");
        }

        $this->newLine();
        $this->info('Certificats créés.');
        $this->checkExisting();
        return 0;
    }

    private function checkExisting(): void
    {
        $total = Certificate::withoutGlobalScopes()->count();
        $this->info("Total certificats en base : {$total}");
    }
}
