<?php

namespace Database\Factories;

use App\Models\Participant;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Participant>
 */
class ParticipantFactory extends Factory
{
    public function definition(): array
    {
        return [
            'tenant_id' => Tenant::factory(),
            'ndis_number' => fake()->unique()->numerify('43########'),
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'date_of_birth' => fake()->dateTimeBetween('-80 years', '-5 years')->format('Y-m-d'),
            'gender' => fake()->randomElement(['male', 'female', 'non_binary', 'prefer_not_to_say']),
            'pronouns' => null,
            'address' => fake()->streetAddress(),
            'suburb' => fake()->city(),
            'state' => fake()->randomElement(['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'ACT', 'NT']),
            'postcode' => fake()->numerify('####'),
            'primary_language' => 'English',
            'interpreter_required' => false,
            'communication_needs' => null,
            'cultural_background' => null,
            'participant_status' => 'active',
        ];
    }

    public function inactive(): static
    {
        return $this->state(['participant_status' => 'inactive']);
    }

    public function pending(): static
    {
        return $this->state(['participant_status' => 'pending']);
    }

    public function forTenant(Tenant $tenant): static
    {
        return $this->state(['tenant_id' => $tenant->id]);
    }
}
