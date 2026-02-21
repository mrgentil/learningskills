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
        Schema::create('onboarding_requests', function (Blueprint $table) {
            $table->id();
            
            // 1. General Info
            $table->string('organization_name');
            $table->string('contact_name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('timezone')->nullable();
            
            // 2. Branding
            $table->string('academy_name');
            $table->string('logo_path')->nullable();
            $table->string('brand_colors')->nullable(); // Can be JSON or string
            $table->boolean('custom_domain')->default(false);
            $table->string('domain_name')->nullable();
            
            // 3. Training Program
            $table->json('training_types')->nullable();
            $table->json('content_types')->nullable();
            $table->boolean('wants_certificates')->default(false);
            
            // 4. Users
            $table->string('estimated_learners')->nullable();
            $table->string('registration_mode')->nullable(); // Self-reg or admin-invitation
            
            // 5. Payments
            $table->boolean('will_sell_courses')->default(false);
            $table->boolean('has_stripe')->default(false);
            
            // 6. Configuration
            $table->json('enabled_features')->nullable(); // IA, Live classes, Community
            
            // 7. Launch
            $table->string('content_readiness')->nullable();
            $table->date('target_launch_date')->nullable();
            $table->text('comments')->nullable();
            
            // Additional system fields
            $table->string('selected_plan')->nullable(); // starter, pro, enterprise
            $table->string('payment_method')->nullable();
            $table->string('status')->default('new'); // new, contacted, deployed, archived
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('onboarding_requests');
    }
};
