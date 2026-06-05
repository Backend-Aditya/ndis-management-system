<?php

namespace Database\Factories;

use App\Models\Participant;
use App\Models\ParticipantDiagnosis;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ParticipantDiagnosis>
 */
class ParticipantDiagnosisFactory extends Factory
{
    public function definition(): array
    {
        return [
            'participant_id' => Participant::factory(),
            'diagnosis_name' => fake()->randomElement([
                'Autism Spectrum Disorder',
                'Intellectual Disability',
                'Cerebral Palsy',
                'Down Syndrome',
                'Acquired Brain Injury',
            ]),
            'icd_10_code' => fake()->regexify('[A-Z][0-9]{2}\.[0-9]'),
            'diagnosed_date' => fake()->dateTimeBetween('-20 years', 'now')->format('Y-m-d'),
            'is_primary' => false,
        ];
    }

    public function primary(): static
    {
        return $this->state(['is_primary' => true]);
    }
}
