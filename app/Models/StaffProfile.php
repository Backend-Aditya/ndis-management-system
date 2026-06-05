<?php

namespace App\Models;

use App\Concerns\HasTenant;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StaffProfile extends Model
{
    use HasFactory, HasTenant, HasUuids;

    protected $fillable = [
        'user_id', 'tenant_id', 'employee_number', 'position', 'department',
        'employment_start', 'employment_end', 'employment_type',
        'hourly_rate', 'kms_rate', 'tax_file_number', 'bank_bsb', 'bank_account',
    ];

    protected function casts(): array
    {
        return [
            'employment_start' => 'date',
            'employment_end' => 'date',
            'hourly_rate' => 'decimal:2',
            'kms_rate' => 'decimal:4',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function qualifications(): HasMany
    {
        return $this->hasMany(StaffQualification::class, 'staff_id');
    }

    public function availability(): HasMany
    {
        return $this->hasMany(StaffAvailability::class, 'staff_id');
    }
}
