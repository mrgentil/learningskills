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
        Schema::create('lesson_completions', function (Blueprint $弾) {
            $弾->id();
            $弾->foreignId('user_id')->constrained()->onDelete('cascade');
            $弾->foreignId('lesson_id')->constrained()->onDelete('cascade');
            $弾->foreignId('course_id')->constrained()->onDelete('cascade');
            $弾->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $弾->timestamp('completed_at')->useCurrent();
            $弾->timestamps();

            $弾->unique(['user_id', 'lesson_id'], 'user_lesson_completion_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lesson_completions');
    }
};
