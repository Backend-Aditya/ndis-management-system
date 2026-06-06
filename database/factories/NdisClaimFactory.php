<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\NdisClaim;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<NdisClaim>
 */
class NdisClaimFactory extends Factory
{
    public function definition(): array
    {
        return [
            'tenant_id' => Tenant::factory(),
            'invoice_id' => Invoice::factory(),
            'claim_reference' => 'CLM-'.fake()->unique()->numerify('######'),
            'claim_type' => fake()->randomElement(['standard', 'cancellation', 'travel']),
            'claim_period_start' => fake()->dateTimeBetween('-2 months', '-1 month')->format('Y-m-d'),
            'claim_period_end' => fake()->dateTimeBetween('-1 month', 'now')->format('Y-m-d'),
            'claim_amount' => fake()->randomFloat(2, 100, 5000),
            'submission_status' => 'pending',
            'portal_response_code' => null,
            'submitted_at' => null,
        ];
    }

    public function forTenant(Tenant $tenant): static
    {
        return $this->state(['tenant_id' => $tenant->id]);
    }
}
