<?php

namespace App\Models;

use Database\Factories\ShiftRecurrenceFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShiftRecurrence extends Model
{
    /** @use HasFactory<ShiftRecurrenceFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'shift_id', 'rrule', 'recurrence_end', 'occurrences_generated',
    ];

    protected function casts(): array
    {
        return [
            'recurrence_end' => 'date',
            'occurrences_generated' => 'integer',
        ];
    }

    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class);
    }
}
