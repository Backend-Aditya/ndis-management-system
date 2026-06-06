<?php

namespace Database\Factories;

use App\Models\AuditLog;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<AuditLog> */
class AuditLogFactory extends Factory
{
    public function definition(): array
    {
        return [
            'tenant_id' => Tenant::factory(),
            'user_id' => User::factory(),
            'action' => fake()->randomElement(['created', 'updated', 'deleted', 'viewed']),
            'resource_type' => fake()->randomElement(['Participant', 'Invoice', 'Shift', 'Incident']),
            'resource_id' => fake()->uuid(),
            'old_values' => null,
            'new_values' => ['status' => 'active'],
            'ip_address' => fake()->ipv4(),
        ];
    }

    public function forTenant(Tenant $tenant): static
    {
        return $this->state(['tenant_id' => $tenant->id]);
    }
}
