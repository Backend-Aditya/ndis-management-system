<?php

namespace App\Models;

use App\Concerns\HasTenant;
use Database\Factories\ServiceTypeFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceType extends Model
{
    /** @use HasFactory<ServiceTypeFactory> */
    use HasFactory, HasTenant, HasUuids;

    protected $fillable = [
        'tenant_id', 'ndis_support_item_number', 'name', 'support_category',
        'unit_of_measure', 'standard_rate', 'weeknight_rate', 'saturday_rate',
        'sunday_rate', 'public_holiday_rate', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'standard_rate' => 'decimal:2',
            'weeknight_rate' => 'decimal:2',
            'saturday_rate' => 'decimal:2',
            'sunday_rate' => 'decimal:2',
            'public_holiday_rate' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function agreementItems(): HasMany
    {
        return $this->hasMany(ServiceAgreementItem::class);
    }
}
