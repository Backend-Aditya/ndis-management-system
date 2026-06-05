<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_agreements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('participant_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('plan_id')->constrained('ndis_plans')->cascadeOnDelete();
            $table->date('agreement_start');
            $table->date('agreement_end');
            $table->string('status');
            $table->string('signed_by_participant')->nullable();
            $table->date('signed_date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_agreements');
    }
};
