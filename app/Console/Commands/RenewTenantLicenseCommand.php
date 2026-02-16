<?php

namespace App\Console\Commands;

use App\Models\TenantLicense;
use Illuminate\Console\Command;

class RenewTenantLicenseCommand extends Command
{
    protected $signature = 'license:renew 
                            {license? : ID de la licence (optionnel)}
                            {--tenant= : ID ou slug du tenant pour renouveler sa licence active}';

    protected $description = 'Renouvelle une licence d\'un an (prolonge expires_at).';

    public function handle(): int
    {
        $licenseId = $this->argument('license');
        $tenantInput = $this->option('tenant');

        if ($licenseId) {
            $license = TenantLicense::find($licenseId);
        } elseif ($tenantInput) {
            $tenant = is_numeric($tenantInput)
                ? \App\Models\Tenant::find($tenantInput)
                : \App\Models\Tenant::where('slug', $tenantInput)->first();
            if (!$tenant) {
                $this->error('Tenant introuvable.');
                return 1;
            }
            $license = $tenant->licenses()->where('status', 'active')->latest('expires_at')->first();
        } else {
            $this->error('Indiquez --tenant= ou l’ID de la licence.');
            return 1;
        }

        if (!$license) {
            $this->error('Licence introuvable.');
            return 1;
        }

        $oldExpires = $license->expires_at->format('d/m/Y');
        $license->renewForOneYear();
        $this->info("Licence #{$license->id} ({$license->name}) renouvelée : {$oldExpires} → {$license->expires_at->format('d/m/Y')}.");
        return 0;
    }
}
