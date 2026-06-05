<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ndis_claims', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('invoice_id')->constrained()->cascadeOnDelete();
            $table->string('claim_reference')->nullable();
            $table->string('claim_type');
            $table->date('claim_period_start');
            $table->date('claim_period_end');
            $table->decimal('claim_amount', 12, 2)->default(0);
            $table->string('submission_status');
            $table->string('portal_response_code')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ndis_claims');
    }
};
