<?php

namespace App\Models;

use App\Concerns\HasTenant;
use Database\Factories\IncidentFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Incident extends Model
{
    /** @use HasFactory<IncidentFactory> */
    use HasFactory, HasTenant, HasUuids;

    protected $fillable = [
        'tenant_id', 'participant_id', 'reported_by', 'shift_id',
        'incident_type', 'severity', 'occurred_at', 'description',
        'immediate_actions', 'notified_participant', 'notified_ndis_commission',
        'ndis_reportable_type', 'status',
    ];

    protected function casts(): array
    {
        return [
            'occurred_at' => 'datetime',
            'notified_participant' => 'boolean',
            'notified_ndis_commission' => 'boolean',
        ];
    }

    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }

    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reported_by');
    }

    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class);
    }

    public function followUps(): HasMany
    {
        return $this->hasMany(IncidentFollowUp::class);
    }
}
