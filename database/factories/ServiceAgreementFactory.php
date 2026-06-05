<?php

namespace Database\Factories;

use App\Models\NdisPlan;
use App\Models\Participant;
use App\Models\ServiceAgreement;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ServiceAgreement>
 */
class ServiceAgreementFactory extends Factory
{
    public function definition(): array
    {
        return [
            'tenant_id' => Tenant::factory(),
            'participant_id' => Participant::factory(),
            'plan_id' => NdisPlan::factory(),
            'agreement_start' => fake()->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
            'agreement_end' => fake()->dateTimeBetween('now', '+1 year')->format('Y-m-d'),
            'status' => 'active',
            'signed_by_participant' => null,
            'signed_date' => null,
        ];
    }

    public function forTenant(Tenant $tenant): static
    {
        return $this->state(['tenant_id' => $tenant->id]);
    }
}
