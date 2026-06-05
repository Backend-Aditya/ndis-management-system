<?php

namespace App\Models;

use Database\Factories\ServiceAgreementItemFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServiceAgreementItem extends Model
{
    /** @use HasFactory<ServiceAgreementItemFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'agreement_id', 'service_type_id', 'quantity_agreed', 'unit_price', 'frequency',
    ];

    protected function casts(): array
    {
        return [
            'quantity_agreed' => 'decimal:2',
            'unit_price' => 'decimal:2',
        ];
    }

    public function agreement(): BelongsTo
    {
        return $this->belongsTo(ServiceAgreement::class, 'agreement_id');
    }

    public function serviceType(): BelongsTo
    {
        return $this->belongsTo(ServiceType::class);
    }
}
