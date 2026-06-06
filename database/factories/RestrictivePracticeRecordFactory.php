<?php

namespace Database\Factories;

use App\Models\Participant;
use App\Models\RestrictivePracticeRecord;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<RestrictivePracticeRecord> */
class RestrictivePracticeRecordFactory extends Factory
{
    public function definition(): array
    {
        return [
            'tenant_id' => Tenant::factory(),
            'participant_id' => Participant::factory(),
            'shift_id' => null,
            'reported_by' => User::factory(),
            'practice_type' => fake()->randomElement(['physical', 'chemical', 'environmental', 'seclusion', 'mechanical']),
            'used_at' => fake()->dateTimeBetween('-1 month', 'now'),
            'duration_minutes' => fake()->numberBetween(1, 120),
            'outcome' => fake()->sentence(),
            'reported_to_commission' => false,
        ];
    }

    public function forTenant(Tenant $tenant): static
    {
        return $this->state(['tenant_id' => $tenant->id]);
    }
}
