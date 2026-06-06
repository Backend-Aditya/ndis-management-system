<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\NdisPlan;
use App\Models\Participant;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Invoice>
 */
class InvoiceFactory extends Factory
{
    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 100, 5000);
        $gst = round($subtotal * 0.1, 2);

        return [
            'tenant_id' => Tenant::factory(),
            'participant_id' => Participant::factory(),
            'plan_id' => NdisPlan::factory(),
            'invoice_number' => 'INV-'.fake()->unique()->numerify('######'),
            'invoice_date' => fake()->dateTimeBetween('-3 months', 'now')->format('Y-m-d'),
            'due_date' => fake()->dateTimeBetween('now', '+1 month')->format('Y-m-d'),
            'subtotal' => $subtotal,
            'gst_amount' => $gst,
            'total_amount' => $subtotal + $gst,
            'status' => 'draft',
            'paid_at' => null,
        ];
    }

    public function forTenant(Tenant $tenant): static
    {
        return $this->state(['tenant_id' => $tenant->id]);
    }

    public function paid(): static
    {
        return $this->state(['status' => 'paid', 'paid_at' => now()]);
    }
}
