<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('behaviour_support_plans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('participant_id')->constrained()->cascadeOnDelete();
            $table->date('plan_date');
            $table->date('review_date')->nullable();
            $table->text('triggers')->nullable();
            $table->text('strategies')->nullable();
            $table->boolean('uses_restrictive_practices')->default(false);
            $table->string('restrictive_practice_type')->nullable();
            $table->string('status');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('behaviour_support_plans');
    }
};
