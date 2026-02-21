<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->enum('pricing_type', ['one_time', 'recurring'])->default('one_time')->after('slug');
            $table->enum('tier', ['starter', 'pro', 'enterprise'])->nullable()->after('pricing_type');
            $table->decimal('setup_price', 10, 2)->default(0)->after('price');
            $table->decimal('maintenance_price', 10, 2)->nullable()->after('setup_price');

            // Make interval nullable (not needed for one_time plans)
            $table->string('interval')->nullable()->default(null)->change();
        });
    }

    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->dropColumn(['pricing_type', 'tier', 'setup_price', 'maintenance_price']);
            $table->enum('interval', ['month', 'year'])->default('month')->change();
        });
    }
};
