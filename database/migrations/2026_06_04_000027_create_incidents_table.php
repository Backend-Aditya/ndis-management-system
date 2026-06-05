<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('incidents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('participant_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('reported_by')->constrained('users')->restrictOnDelete();
            $table->foreignUuid('shift_id')->nullable()->constrained()->nullOnDelete();
            $table->string('incident_type');
            $table->string('severity');
            $table->dateTime('occurred_at');
            $table->text('description');
            $table->text('immediate_actions')->nullable();
            $table->boolean('notified_participant')->default(false);
            $table->boolean('notified_ndis_commission')->default(false);
            $table->string('ndis_reportable_type')->nullable();
            $table->string('status');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('incidents');
    }
};
