<?php

namespace App\Models;

use Database\Factories\SupportCoordinatorFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SupportCoordinator extends Model
{
    /** @use HasFactory<SupportCoordinatorFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'participant_id', 'staff_id', 'assigned_from', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'assigned_from' => 'date',
            'is_active' => 'boolean',
        ];
    }

    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(User::class, 'staff_id');
    }
}
