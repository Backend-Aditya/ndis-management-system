<?php

namespace App\Models;

use App\Concerns\HasTenant;
use Database\Factories\InvoiceFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Invoice extends Model
{
    /** @use HasFactory<InvoiceFactory> */
    use HasFactory, HasTenant, HasUuids;

    protected $fillable = [
        'tenant_id', 'participant_id', 'plan_id', 'invoice_number',
        'invoice_date', 'due_date', 'subtotal', 'gst_amount',
        'total_amount', 'status', 'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'invoice_date' => 'date',
            'due_date' => 'date',
            'paid_at' => 'datetime',
            'subtotal' => 'decimal:2',
            'gst_amount' => 'decimal:2',
            'total_amount' => 'decimal:2',
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

    public function lineItems(): HasMany
    {
        return $this->hasMany(InvoiceLineItem::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function claim(): HasOne
    {
        return $this->hasOne(NdisClaim::class);
    }
}
