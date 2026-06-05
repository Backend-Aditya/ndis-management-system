<?php

namespace Database\Factories;

use App\Models\StaffProfile;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<StaffProfile>
 */
class StaffProfileFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'tenant_id' => Tenant::factory(),
            'employee_number' => fake()->numerify('EMP-####'),
            'position' => fake()->randomElement(['Support Worker', 'Team Leader', 'Coordinator']),
            'department' => fake()->randomElement(['Community', 'Residential', 'Day Programs']),
            'employment_start' => fake()->dateTimeBetween('-3 years', '-1 month'),
            'employment_type' => fake()->randomElement(['full_time', 'part_time', 'casual']),
            'hourly_rate' => fake()->randomFloat(2, 28, 55),
            'kms_rate' => 0.96,
        ];
    }
}
