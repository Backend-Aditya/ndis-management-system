<?php

namespace Database\Factories;

use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Tenant>
 */
class TenantFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->company();

        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'.fake()->unique()->numerify('###'),
            'plan' => 'starter',
            'status' => 'active',
            'abn' => fake()->numerify('## ### ### ###'),
            'ndis_provider_number' => fake()->numerify('4#######'),
            'contact_email' => fake()->companyEmail(),
            'contact_phone' => fake()->phoneNumber(),
            'settings' => [],
        ];
    }

    public function trialing(): static
    {
        return $this->state(['status' => 'trialing', 'trial_ends_at' => now()->addDays(14)]);
    }

    public function suspended(): static
    {
        return $this->state(['status' => 'suspended']);
    }
}
