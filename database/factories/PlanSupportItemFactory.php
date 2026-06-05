<?php

namespace Database\Factories;

use App\Models\PlanSupportCategory;
use App\Models\PlanSupportItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PlanSupportItem>
 */
class PlanSupportItemFactory extends Factory
{
    public function definition(): array
    {
        return [
            'category_id' => PlanSupportCategory::factory(),
            'support_item_number' => fake()->numerify('01_###_####_#_#'),
            'support_item_name' => fake()->sentence(4),
            'unit_of_measure' => 'H',
            'unit_price' => fake()->randomFloat(2, 30, 120),
            'quantity_allocated' => fake()->randomFloat(2, 10, 200),
            'quantity_used' => 0,
        ];
    }
}
