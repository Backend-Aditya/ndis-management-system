<?php

namespace App\Models;

use Database\Factories\ShiftCancellationFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShiftCancellation extends Model
{
    /** @use HasFactory<ShiftCancellationFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'shift_id', 'cancelled_by_type', 'cancelled_by_user',
        'reason_code', 'reason_notes', 'billable',
    ];

    protected function casts(): array
    {
        return [
            'billable' => 'boolean',
        ];
    }

    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class);
    }

    public function cancelledByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cancelled_by_user');
    }
}
