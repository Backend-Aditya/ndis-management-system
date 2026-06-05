<?php

namespace Database\Factories;

use App\Models\NdisPlan;
use App\Models\Participant;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<NdisPlan>
 */
class NdisPlanFactory extends Factory
{
    public function definition(): array
    {
        $start = fake()->dateTimeBetween('-2 years', 'now');
        $end = (clone $start)->modify('+12 months');
        $core = fake()->randomFloat(2, 10000, 80000);
        $capacity = fake()->randomFloat(2, 5000, 30000);
        $capital = fake()->randomFloat(2, 0, 20000);

        return [
            'tenant_id' => Tenant::factory(),
            'participant_id' => Participant::factory(),
            'plan_number' => fake()->numerify('PLAN-#####'),
            'plan_start_date' => $start->format('Y-m-d'),
            'plan_end_date' => $end->format('Y-m-d'),
            'plan_type' => 'standard',
            'management_type' => fake()->randomElement(['agency_managed', 'plan_managed', 'self_managed']),
            'core_total' => $core,
            'capacity_total' => $capacity,
            'capital_total' => $capital,
            'total_funding' => $core + $capacity + $capital,
            'status' => 'active',
            'ndia_contact_name' => fake()->name(),
            'ndia_contact_phone' => fake()->phoneNumber(),
        ];
    }

    public function forTenant(Tenant $tenant): static
    {
        return $this->state(['tenant_id' => $tenant->id]);
    }

    public function forParticipant(Participant $participant): static
    {
        return $this->state([
            'participant_id' => $participant->id,
            'tenant_id' => $participant->tenant_id,
        ]);
    }
}
