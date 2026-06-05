<?php

namespace App\Models;

use Database\Factories\TenantFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Cashier\Billable;

class Tenant extends Model
{
    /** @use HasFactory<TenantFactory> */
    use Billable, HasFactory, HasUuids;

    protected $fillable = [
        'name', 'slug', 'plan', 'status', 'abn',
        'ndis_provider_number', 'contact_email', 'contact_phone',
        'settings', 'stripe_id', 'pm_type', 'pm_last_four', 'trial_ends_at',
    ];

    protected function casts(): array
    {
        return [
            'settings' => 'array',
            'trial_ends_at' => 'datetime',
        ];
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
