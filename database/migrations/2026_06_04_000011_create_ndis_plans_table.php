<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ndis_plans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('participant_id')->constrained()->cascadeOnDelete();
            $table->string('plan_number')->nullable();
            $table->date('plan_start_date');
            $table->date('plan_end_date');
            $table->string('plan_type')->nullable();
            $table->string('management_type');
            $table->decimal('core_total', 12, 2)->default(0);
            $table->decimal('capacity_total', 12, 2)->default(0);
            $table->decimal('capital_total', 12, 2)->default(0);
            $table->decimal('total_funding', 12, 2)->default(0);
            $table->string('status');
            $table->string('ndia_contact_name')->nullable();
            $table->string('ndia_contact_phone')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ndis_plans');
    }
};
