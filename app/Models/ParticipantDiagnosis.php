<?php

namespace App\Models;

use Database\Factories\ParticipantDiagnosisFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ParticipantDiagnosis extends Model
{
    /** @use HasFactory<ParticipantDiagnosisFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'participant_id', 'diagnosis_name', 'icd_10_code', 'diagnosed_date', 'is_primary',
    ];

    protected function casts(): array
    {
        return [
            'diagnosed_date' => 'date',
            'is_primary' => 'boolean',
        ];
    }

    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }
}
