<?php

namespace Database\Factories;

use App\Models\Audit;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Audit> */
class AuditFactory extends Factory
{
    public function definition(): array
    {
        return [
            'tenant_id' => Tenant::factory(),
            'audit_type' => fake()->randomElement(['certification', 'verification', 'mid_term', 'practice_standard']),
            'auditor_name' => fake()->name(),
            'audit_date' => fake()->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
            'next_audit_date' => fake()->dateTimeBetween('+6 months', '+2 years')->format('Y-m-d'),
            'outcome' => fake()->randomElement(['pass', 'conditional', 'minor_nc', 'major_nc']),
            'status' => 'completed',
        ];
    }

    public function forTenant(Tenant $tenant): static
    {
        return $this->state(['tenant_id' => $tenant->id]);
    }
}
