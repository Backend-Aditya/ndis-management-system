<?php

namespace App\Models;

use App\Concerns\HasTenant;
use Database\Factories\NdisPlanFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NdisPlan extends Model
{
    /** @use HasFactory<NdisPlanFactory> */
    use HasFactory, HasTenant, HasUuids;

    protected $fillable = [
        'tenant_id', 'participant_id', 'plan_number', 'plan_start_date', 'plan_end_date',
        'plan_type', 'management_type', 'core_total', 'capacity_total', 'capital_total',
        'total_funding', 'status', 'ndia_contact_name', 'ndia_contact_phone',
    ];

    protected function casts(): array
    {
        return [
            'plan_start_date' => 'date',
            'plan_end_date' => 'date',
            'core_total' => 'decimal:2',
            'capacity_total' => 'decimal:2',
            'capital_total' => 'decimal:2',
            'total_funding' => 'decimal:2',
        ];
    }

    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }

    public function supportCategories(): HasMany
    {
        return $this->hasMany(PlanSupportCategory::class, 'plan_id');
    }

    public function managers(): HasMany
    {
        return $this->hasMany(PlanManager::class, 'plan_id');
    }

    public function serviceAgreements(): HasMany
    {
        return $this->hasMany(ServiceAgreement::class, 'plan_id');
    }
}
