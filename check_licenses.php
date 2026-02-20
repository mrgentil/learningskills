<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Tenant;
use App\Models\TenantLicense;

$tenants = Tenant::all();
foreach ($tenants as $t) {
    echo "Tenant: " . $t->name . "\n";
    $licenseCount = $t->activeLicense()->count();
    $owner = $t->owner;
    $isSubscribed = $owner && $owner->subscribed('default');
    
    echo "  - Active Licenses: " . $licenseCount . "\n";
    echo "  - Stripe Subscribed: " . ($isSubscribed ? 'YES' : 'NO') . "\n";
    echo "-----------------------------------\n";
}
