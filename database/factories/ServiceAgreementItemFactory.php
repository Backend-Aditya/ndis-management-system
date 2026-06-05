<?php

namespace Database\Factories;

use App\Models\ServiceAgreement;
use App\Models\ServiceAgreementItem;
use App\Models\ServiceType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ServiceAgreementItem>
 */
class ServiceAgreementItemFactory extends Factory
{
    public function definition(): array
    {
        return [
            'agreement_id' => ServiceAgreement::factory(),
            'service_type_id' => ServiceType::factory(),
            'quantity_agreed' => fake()->randomFloat(2, 10, 100),
            'unit_price' => fake()->randomFloat(2, 30, 120),
            'frequency' => fake()->randomElement(['weekly', 'fortnightly', 'monthly']),
        ];
    }
}
