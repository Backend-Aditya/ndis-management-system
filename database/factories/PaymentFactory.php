<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'invoice_id' => Invoice::factory(),
            'amount' => fake()->randomFloat(2, 100, 5000),
            'payment_method' => fake()->randomElement(['bank_transfer', 'credit_card', 'direct_debit']),
            'reference_number' => fake()->numerify('REF-######'),
            'payer_name' => fake()->name(),
            'payment_date' => fake()->dateTimeBetween('-1 month', 'now')->format('Y-m-d'),
            'status' => 'completed',
        ];
    }
}
