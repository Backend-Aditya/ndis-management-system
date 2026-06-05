<?php

namespace App\Models;

use App\Concerns\HasTenant;
use Database\Factories\ServiceAgreementFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceAgreement extends Model
{
    /** @use HasFactory<ServiceAgreementFactory> */
    use HasFactory, HasTenant, HasUuids;

    protected $fillable = [
        'tenant_id', 'participant_id', 'plan_id', 'agreement_start', 'agreement_end',
        'status', 'signed_by_participant', 'signed_date',
    ];

    protected function casts(): array
    {
        return [
            'agreement_start' => 'date',
            'agreement_end' => 'date',
            'signed_date' => 'date',
        ];
    }

    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(NdisPlan::class, 'plan_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(ServiceAgreementItem::class, 'agreement_id');
    }
}
