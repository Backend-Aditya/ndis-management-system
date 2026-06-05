<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_agreement_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('agreement_id')->constrained('service_agreements')->cascadeOnDelete();
            $table->foreignUuid('service_type_id')->constrained('service_types')->restrictOnDelete();
            $table->decimal('quantity_agreed', 10, 2)->default(0);
            $table->decimal('unit_price', 10, 2)->default(0);
            $table->string('frequency')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_agreement_items');
    }
};
