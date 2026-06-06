<?php

namespace App\Models;

use Database\Factories\ShiftHandoverNoteFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShiftHandoverNote extends Model
{
    /** @use HasFactory<ShiftHandoverNoteFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'shift_id', 'staff_id', 'content', 'status', 'submitted_at', 'reviewed_by',
    ];

    protected function casts(): array
    {
        return [
            'submitted_at' => 'datetime',
        ];
    }

    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class);
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
