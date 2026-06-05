<?php

namespace Database\Factories;

use App\Models\NdisPlan;
use App\Models\PlanManager;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PlanManager>
 */
class PlanManagerFactory extends Factory
{
    public function definition(): array
    {
        return [
            'plan_id' => NdisPlan::factory(),
            'manager_type' => 'plan_manager',
            'company_name' => fake()->company(),
            'contact_name' => fake()->name(),
            'email' => fake()->companyEmail(),
            'abn' => fake()->numerify('## ### ### ###'),
        ];
    }
}
