<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Licences clients : droits étendus, maintenance incluse, renouvelables par année.
     */
    public function up(): void
    {
        Schema::create('tenant_licenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->string('name'); // ex: "Licence Annuelle Client XYZ"
            $table->date('starts_at');
            $table->date('expires_at');
            $table->date('renewed_at')->nullable(); // dernière date de renouvellement
            $table->boolean('maintenance_included')->default(true); // vous gardez la maintenance
            $table->json('rights')->nullable(); // ex: ["unlimited_courses", "unlimited_students", "priority_support", "custom_domain"]
            $table->enum('status', ['active', 'expired', 'pending_renewal'])->default('active');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'status']);
            $table->index('expires_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tenant_licenses');
    }
};
