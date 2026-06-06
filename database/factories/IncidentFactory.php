<?php

namespace Database\Factories;

use App\Models\Incident;
use App\Models\Participant;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Incident> */
class IncidentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'tenant_id' => Tenant::factory(),
            'participant_id' => Participant::factory(),
            'reported_by' => User::factory(),
            'shift_id' => null,
            'incident_type' => fake()->randomElement(['injury', 'medication_error', 'behaviour', 'property_damage', 'abuse_neglect']),
            'severity' => fake()->randomElement(['low', 'medium', 'high', 'critical']),
            'occurred_at' => fake()->dateTimeBetween('-1 month', 'now'),
            'description' => fake()->paragraph(),
            'immediate_actions' => fake()->sentence(),
            'notified_participant' => false,
            'notified_ndis_commission' => false,
            'ndis_reportable_type' => null,
            'status' => 'open',
        ];
    }

    public function forTenant(Tenant $tenant): static
    {
        return $this->state(['tenant_id' => $tenant->id]);
    }
}
