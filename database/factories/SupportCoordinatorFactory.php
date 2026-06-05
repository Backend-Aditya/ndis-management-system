<?php

namespace Database\Factories;

use App\Models\Participant;
use App\Models\SupportCoordinator;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SupportCoordinator>
 */
class SupportCoordinatorFactory extends Factory
{
    public function definition(): array
    {
        return [
            'participant_id' => Participant::factory(),
            'staff_id' => User::factory(),
            'assigned_from' => fake()->dateTimeBetween('-2 years', 'now')->format('Y-m-d'),
            'is_active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(['is_active' => false]);
    }
}
