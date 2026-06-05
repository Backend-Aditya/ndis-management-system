<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plan_support_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('category_id')->constrained('plan_support_categories')->cascadeOnDelete();
            $table->string('support_item_number')->nullable();
            $table->string('support_item_name');
            $table->string('unit_of_measure')->nullable();
            $table->decimal('unit_price', 10, 2)->default(0);
            $table->decimal('quantity_allocated', 10, 2)->default(0);
            $table->decimal('quantity_used', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plan_support_items');
    }
};
