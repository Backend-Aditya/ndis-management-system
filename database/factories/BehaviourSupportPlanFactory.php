<?php

namespace Database\Factories;

use App\Models\BehaviourSupportPlan;
use App\Models\Participant;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<BehaviourSupportPlan> */
class BehaviourSupportPlanFactory extends Factory
{
    public function definition(): array
    {
        return [
            'tenant_id' => Tenant::factory(),
            'participant_id' => Participant::factory(),
            'plan_date' => fake()->dateTimeBetween('-6 months', 'now')->format('Y-m-d'),
            'review_date' => fake()->dateTimeBetween('now', '+6 months')->format('Y-m-d'),
            'triggers' => fake()->paragraph(),
            'strategies' => fake()->paragraph(),
            'uses_restrictive_practices' => false,
            'restrictive_practice_type' => null,
            'status' => 'active',
        ];
    }

    public function forTenant(Tenant $tenant): static
    {
        return $this->state(['tenant_id' => $tenant->id]);
    }
}
