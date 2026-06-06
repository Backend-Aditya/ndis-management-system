<?php

namespace App\Models;

use App\Concerns\HasTenant;
use Database\Factories\RestrictivePracticeRecordFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RestrictivePracticeRecord extends Model
{
    /** @use HasFactory<RestrictivePracticeRecordFactory> */
    use HasFactory, HasTenant, HasUuids;

    protected $fillable = [
        'tenant_id', 'participant_id', 'shift_id', 'reported_by',
        'practice_type', 'used_at', 'duration_minutes', 'outcome', 'reported_to_commission',
    ];

    protected function casts(): array
    {
        return [
            'used_at' => 'datetime',
            'duration_minutes' => 'integer',
            'reported_to_commission' => 'boolean',
        ];
    }

    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }

    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class);
    }

    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reported_by');
    }
}
