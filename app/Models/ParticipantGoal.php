<?php

namespace App\Models;

use Database\Factories\ParticipantGoalFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ParticipantGoal extends Model
{
    /** @use HasFactory<ParticipantGoalFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'participant_id', 'goal_text', 'category', 'status', 'target_date', 'progress_notes',
    ];

    protected function casts(): array
    {
        return [
            'target_date' => 'date',
        ];
    }

    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }
}
