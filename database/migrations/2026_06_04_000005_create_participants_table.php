<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('participants', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('ndis_number')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->date('date_of_birth')->nullable();
            $table->string('gender')->nullable();
            $table->string('pronouns')->nullable();
            $table->text('address')->nullable();
            $table->string('suburb')->nullable();
            $table->string('state', 10)->nullable();
            $table->string('postcode', 10)->nullable();
            $table->string('primary_language')->nullable();
            $table->boolean('interpreter_required')->default(false);
            $table->string('communication_needs')->nullable();
            $table->string('cultural_background')->nullable();
            $table->string('participant_status');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('participants');
    }
};
