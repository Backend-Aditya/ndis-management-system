<?php

namespace App\Models;

use App\Concerns\HasTenant;
use Database\Factories\NdisClaimFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NdisClaim extends Model
{
    /** @use HasFactory<NdisClaimFactory> */
    use HasFactory, HasTenant, HasUuids;

    protected $fillable = [
        'tenant_id', 'invoice_id', 'claim_reference', 'claim_type',
        'claim_period_start', 'claim_period_end', 'claim_amount',
        'submission_status', 'portal_response_code', 'submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'claim_period_start' => 'date',
            'claim_period_end' => 'date',
            'submitted_at' => 'datetime',
            'claim_amount' => 'decimal:2',
        ];
    }

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }
}
