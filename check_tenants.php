<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Tenant;

$tenants = Tenant::all();
foreach ($tenants as $t) {
    echo "Tenant: " . $t->name . "\n";
    echo "  - Active: " . ($t->is_active ? 'YES' : 'NO') . "\n";
    echo "  - Plan: " . ($t->plan?->name ?? 'NONE') . " (Price: " . ($t->plan?->price ?? 'N/A') . ")\n";
    echo "  - Owner: " . ($t->owner?->email ?? 'N/A') . "\n";
    echo "-----------------------------------\n";
}
