<?php

namespace Database\Factories;

use App\Models\NdisPlan;
use App\Models\PlanSupportCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PlanSupportCategory>
 */
class PlanSupportCategoryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'plan_id' => NdisPlan::factory(),
            'support_purpose' => fake()->randomElement(['Core', 'Capacity Building', 'Capital']),
            'category_name' => fake()->randomElement(['Daily Activities', 'Social & Community', 'Support Coordination']),
            'allocated_amount' => fake()->randomFloat(2, 5000, 50000),
            'spent_amount' => fake()->randomFloat(2, 0, 5000),
        ];
    }
}
