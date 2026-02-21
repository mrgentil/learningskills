<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tenant_licenses', function (Blueprint $table) {
            $table->integer('max_courses')->nullable()->after('rights');
            $table->integer('max_students')->nullable()->after('max_courses');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tenant_licenses', function (Blueprint $table) {
            $table->dropColumn(['max_courses', 'max_students']);
        });
    }
};
