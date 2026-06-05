<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_types', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('ndis_support_item_number')->nullable();
            $table->string('name');
            $table->string('support_category')->nullable();
            $table->string('unit_of_measure')->nullable();
            $table->decimal('standard_rate', 10, 2)->default(0);
            $table->decimal('weeknight_rate', 10, 2)->nullable();
            $table->decimal('saturday_rate', 10, 2)->nullable();
            $table->decimal('sunday_rate', 10, 2)->nullable();
            $table->decimal('public_holiday_rate', 10, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_types');
    }
};
