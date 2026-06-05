<?php

namespace App\Models;

use Database\Factories\ParticipantContactFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ParticipantContact extends Model
{
    /** @use HasFactory<ParticipantContactFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'participant_id', 'relationship', 'first_name', 'last_name',
        'phone', 'email', 'is_emergency', 'is_authorised_rep',
    ];

    protected function casts(): array
    {
        return [
            'is_emergency' => 'boolean',
            'is_authorised_rep' => 'boolean',
        ];
    }

    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }
}
