<?php

namespace Database\Factories;

use App\Models\Participant;
use App\Models\ParticipantGoal;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ParticipantGoal>
 */
class ParticipantGoalFactory extends Factory
{
    public function definition(): array
    {
        return [
            'participant_id' => Participant::factory(),
            'goal_text' => fake()->sentence(),
            'category' => fake()->randomElement(['daily_living', 'social', 'employment', 'health', 'education']),
            'status' => fake()->randomElement(['active', 'achieved', 'on_hold']),
            'target_date' => fake()->dateTimeBetween('now', '+2 years')->format('Y-m-d'),
            'progress_notes' => null,
        ];
    }

    public function achieved(): static
    {
        return $this->state(['status' => 'achieved']);
    }

    public function active(): static
    {
        return $this->state(['status' => 'active']);
    }
}
