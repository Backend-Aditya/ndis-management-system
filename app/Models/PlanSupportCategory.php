<?php

namespace App\Models;

use Database\Factories\PlanSupportCategoryFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PlanSupportCategory extends Model
{
    /** @use HasFactory<PlanSupportCategoryFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'plan_id', 'support_purpose', 'category_name', 'allocated_amount', 'spent_amount',
    ];

    protected function casts(): array
    {
        return [
            'allocated_amount' => 'decimal:2',
            'spent_amount' => 'decimal:2',
        ];
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(NdisPlan::class, 'plan_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(PlanSupportItem::class, 'category_id');
    }
}
