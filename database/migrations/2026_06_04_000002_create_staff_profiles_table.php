<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('staff_profiles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('employee_number')->nullable();
            $table->string('position')->nullable();
            $table->string('department')->nullable();
            $table->date('employment_start')->nullable();
            $table->date('employment_end')->nullable();
            $table->string('employment_type')->nullable();
            $table->decimal('hourly_rate', 8, 2)->nullable();
            $table->decimal('kms_rate', 6, 4)->nullable();
            $table->string('tax_file_number')->nullable();
            $table->string('bank_bsb')->nullable();
            $table->string('bank_account')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staff_profiles');
    }
};
