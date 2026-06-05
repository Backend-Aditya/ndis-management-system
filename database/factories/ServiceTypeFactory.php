<?php

namespace Database\Factories;

use App\Models\ServiceType;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ServiceType>
 */
class ServiceTypeFactory extends Factory
{
    public function definition(): array
    {
        return [
            'tenant_id' => Tenant::factory(),
            'ndis_support_item_number' => fake()->numerify('01_###_####_#_#'),
            'name' => fake()->randomElement([
                'Daily Activities - Standard - Weekday Daytime',
                'Community Participation - Standard',
                'Support Coordination',
                'Plan Management',
                'Personal Care - Weekday',
            ]),
            'support_category' => fake()->randomElement(['Daily Activities', 'Community Participation', 'Support Coordination']),
            'unit_of_measure' => 'H',
            'standard_rate' => fake()->randomFloat(2, 30, 120),
            'weeknight_rate' => null,
            'saturday_rate' => null,
            'sunday_rate' => null,
            'public_holiday_rate' => null,
            'is_active' => true,
        ];
    }

    public function forTenant(Tenant $tenant): static
    {
        return $this->state(['tenant_id' => $tenant->id]);
    }
}
