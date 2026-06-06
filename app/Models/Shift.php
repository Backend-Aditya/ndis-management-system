<?php

namespace App\Models;

use App\Concerns\HasTenant;
use Database\Factories\ShiftFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Shift extends Model
{
    /** @use HasFactory<ShiftFactory> */
    use HasFactory, HasTenant, HasUuids;

    protected $fillable = [
        'tenant_id', 'participant_id', 'staff_id', 'service_type_id',
        'scheduled_start', 'scheduled_end', 'actual_start', 'actual_end',
        'status', 'location', 'requires_transport', 'kms_travelled', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_start' => 'datetime',
            'scheduled_end' => 'datetime',
            'actual_start' => 'datetime',
            'actual_end' => 'datetime',
            'requires_transport' => 'boolean',
            'kms_travelled' => 'decimal:2',
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

    public function serviceType(): BelongsTo
    {
        return $this->belongsTo(ServiceType::class);
    }

    public function recurrence(): HasOne
    {
        return $this->hasOne(ShiftRecurrence::class);
    }

    public function cancellation(): HasOne
    {
        return $this->hasOne(ShiftCancellation::class);
    }

    public function handoverNotes(): HasMany
    {
        return $this->hasMany(ShiftHandoverNote::class);
    }
}
