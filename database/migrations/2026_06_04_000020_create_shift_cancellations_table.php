<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shift_cancellations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('shift_id')->constrained()->cascadeOnDelete();
            $table->string('cancelled_by_type');
            $table->foreignUuid('cancelled_by_user')->constrained('users')->restrictOnDelete();
            $table->string('reason_code')->nullable();
            $table->text('reason_notes')->nullable();
            $table->boolean('billable')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shift_cancellations');
    }
};
