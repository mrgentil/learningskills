<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Tenant;

$users = User::all();
foreach ($users as $u) {
    echo "User: " . $u->email . " (SuperAdmin: " . ($u->is_super_admin ? 'YES' : 'NO') . ")\n";
    foreach ($u->ownedTenants as $at) {
        echo "  - OWNS Academy: " . $at->name . " (Active: " . ($at->is_active ? 'YES' : 'NO') . ", Plan: " . ($at->plan?->name ?? 'NONE') . ")\n";
    }
    foreach ($u->tenants as $mt) {
        echo "  - MEMBER of Academy: " . $mt->name . " (Role: " . $mt->pivot->role . ")\n";
    }
    echo "-----------------------------------\n";
}
