<?php

namespace Database\Factories;

use App\Models\Incident;
use App\Models\IncidentFollowUp;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<IncidentFollowUp> */
class IncidentFollowUpFactory extends Factory
{
    public function definition(): array
    {
        return [
            'incident_id' => Incident::factory(),
            'staff_id' => User::factory(),
            'action_taken' => fake()->sentence(),
            'is_resolved' => false,
        ];
    }
}
