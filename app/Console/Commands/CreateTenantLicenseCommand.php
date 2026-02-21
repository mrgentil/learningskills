<?php

namespace App\Console\Commands;

use App\Models\Tenant;
use App\Models\TenantLicense;
use Illuminate\Console\Command;

class CreateTenantLicenseCommand extends Command
{
    protected $signature = 'license:create 
                            {tenant : ID ou slug du tenant (académie)} 
                            {--name= : Nom de la licence (défaut: Licence Annuelle)}
                            {--years=1 : Nombre d\'années de validité}
                            {--maintenance=1 : Maintenance incluse (1/0)}
                            {--lifetime : Créer une licence à vie (perpétuelle)}';

    protected $description = 'Crée une licence annuelle ou à vie pour un client (tenant) avec droits étendus.';

    public function handle(): int
    {
        $tenantInput = $this->argument('tenant');
        $tenant = is_numeric($tenantInput)
            ? Tenant::find($tenantInput)
            : Tenant::where('slug', $tenantInput)->first();

        if (!$tenant) {
            $this->error('Tenant introuvable.');
            return 1;
        }

        $name = $this->option('name') ?: 'Licence Annuelle';
        $years = (int) $this->option('years');
        $maintenance = (bool) $this->option('maintenance');
        $lifetime = (bool) $this->option('lifetime');

        $startsAt = now()->toDateString();
        $expiresAt = $lifetime ? null : now()->addYears($years)->toDateString();

        $license = TenantLicense::create([
            'tenant_id' => $tenant->id,
            'name' => $name,
            'starts_at' => $startsAt,
            'expires_at' => $expiresAt,
            'maintenance_included' => $maintenance,
            'rights' => ['unlimited_courses', 'unlimited_students', 'priority_support'],
            'status' => 'active',
        ]);

        $this->info("Licence créée pour {$tenant->name} (#{$tenant->id}).");
        $this->table(
            ['Champ', 'Valeur'],
            [
                ['ID', $license->id],
                ['Nom', $license->name],
                ['Début', $license->starts_at->format('d/m/Y')],
                ['Expiration', $license->expires_at ? $license->expires_at->format('d/m/Y') : 'À vie'],
                ['Maintenance incluse', $license->maintenance_included ? 'Oui' : 'Non'],
            ]
        );
        return 0;
    }
}
