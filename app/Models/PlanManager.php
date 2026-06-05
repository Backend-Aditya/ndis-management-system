<?php

namespace App\Models;

use Database\Factories\PlanManagerFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlanManager extends Model
{
    /** @use HasFactory<PlanManagerFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'plan_id', 'manager_type', 'company_name', 'contact_name', 'email', 'abn',
    ];

    public function plan(): BelongsTo
    {
        return $this->belongsTo(NdisPlan::class, 'plan_id');
    }
}
