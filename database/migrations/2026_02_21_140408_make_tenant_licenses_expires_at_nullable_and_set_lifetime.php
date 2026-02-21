<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Permanent licenses by making expires_at nullable and updating existing ones.
     */
    public function up(): void
    {
        Schema::table('tenant_licenses', function (Blueprint $table) {
            $table->date('expires_at')->nullable()->change();
        });

        // Set all existing active licenses to lifetime
        DB::table('tenant_licenses')
            ->where('status', 'active')
            ->update(['expires_at' => null]);
    }

    public function down(): void
    {
        Schema::table('tenant_licenses', function (Blueprint $table) {
            // Reverting back to non-nullable (will require a default if any are null)
            $table->date('expires_at')->nullable(false)->change();
        });
    }
};
