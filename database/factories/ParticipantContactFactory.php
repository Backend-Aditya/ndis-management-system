<?php

namespace Database\Factories;

use App\Models\Participant;
use App\Models\ParticipantContact;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ParticipantContact>
 */
class ParticipantContactFactory extends Factory
{
    public function definition(): array
    {
        return [
            'participant_id' => Participant::factory(),
            'relationship' => fake()->randomElement(['parent', 'sibling', 'guardian', 'carer']),
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->safeEmail(),
            'is_emergency' => false,
            'is_authorised_rep' => false,
        ];
    }

    public function emergency(): static
    {
        return $this->state(['is_emergency' => true]);
    }

    public function authorisedRep(): static
    {
        return $this->state(['is_authorised_rep' => true]);
    }
}
