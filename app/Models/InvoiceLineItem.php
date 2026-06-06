<?php

namespace App\Models;

use Database\Factories\InvoiceLineItemFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvoiceLineItem extends Model
{
    /** @use HasFactory<InvoiceLineItemFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'invoice_id', 'shift_id', 'service_type_id', 'description',
        'support_item_number', 'service_date', 'quantity', 'unit_price', 'line_total',
    ];

    protected function casts(): array
    {
        return [
            'service_date' => 'date',
            'quantity' => 'decimal:2',
            'unit_price' => 'decimal:2',
            'line_total' => 'decimal:2',
        ];
    }

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class);
    }

    public function serviceType(): BelongsTo
    {
        return $this->belongsTo(ServiceType::class);
    }
}
