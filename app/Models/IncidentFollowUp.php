<?php

namespace App\Models;

use Database\Factories\IncidentFollowUpFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IncidentFollowUp extends Model
{
    /** @use HasFactory<IncidentFollowUpFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'incident_id', 'staff_id', 'action_taken', 'is_resolved',
    ];

    protected function casts(): array
    {
        return [
            'is_resolved' => 'boolean',
        ];
    }

    public function incident(): BelongsTo
    {
        return $this->belongsTo(Incident::class);
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(User::class, 'staff_id');
    }
}
