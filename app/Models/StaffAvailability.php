<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StaffAvailability extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'staff_id', 'day_of_week', 'start_time', 'end_time',
        'is_recurring', 'effective_from', 'effective_to',
    ];

    protected function casts(): array
    {
        return [
            'is_recurring' => 'boolean',
            'effective_from' => 'date',
            'effective_to' => 'date',
        ];
    }

    public function staffProfile(): BelongsTo
    {
        return $this->belongsTo(StaffProfile::class, 'staff_id');
    }
}
