<?php

namespace Database\Factories;

use App\Models\Participant;
use App\Models\RiskAssessment;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<RiskAssessment> */
class RiskAssessmentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'tenant_id' => Tenant::factory(),
            'participant_id' => Participant::factory(),
            'risk_area' => fake()->randomElement(['mobility', 'medication', 'behaviour', 'environment', 'health']),
            'risk_description' => fake()->paragraph(),
            'likelihood' => fake()->randomElement(['rare', 'unlikely', 'possible', 'likely', 'almost_certain']),
            'impact' => fake()->randomElement(['negligible', 'minor', 'moderate', 'major', 'severe']),
            'risk_level' => fake()->randomElement(['low', 'medium', 'high', 'extreme']),
            'mitigation_strategies' => fake()->paragraph(),
            'review_date' => fake()->dateTimeBetween('now', '+6 months')->format('Y-m-d'),
        ];
    }

    public function forTenant(Tenant $tenant): static
    {
        return $this->state(['tenant_id' => $tenant->id]);
    }
}
