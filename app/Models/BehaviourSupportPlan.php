<?php

namespace App\Models;

use App\Concerns\HasTenant;
use Database\Factories\BehaviourSupportPlanFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BehaviourSupportPlan extends Model
{
    /** @use HasFactory<BehaviourSupportPlanFactory> */
    use HasFactory, HasTenant, HasUuids;

    protected $fillable = [
        'tenant_id', 'participant_id', 'plan_date', 'review_date',
        'triggers', 'strategies', 'uses_restrictive_practices',
        'restrictive_practice_type', 'status',
    ];

    protected function casts(): array
    {
        return [
            'plan_date' => 'date',
            'review_date' => 'date',
            'uses_restrictive_practices' => 'boolean',
        ];
    }

    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }
}
