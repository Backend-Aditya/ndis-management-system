<?php

namespace App\Models;

use Database\Factories\PlanSupportItemFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlanSupportItem extends Model
{
    /** @use HasFactory<PlanSupportItemFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'category_id', 'support_item_number', 'support_item_name',
        'unit_of_measure', 'unit_price', 'quantity_allocated', 'quantity_used',
    ];

    protected function casts(): array
    {
        return [
            'unit_price' => 'decimal:2',
            'quantity_allocated' => 'decimal:2',
            'quantity_used' => 'decimal:2',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(PlanSupportCategory::class, 'category_id');
    }
}
