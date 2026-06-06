<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\InvoiceLineItem;
use App\Models\ServiceType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<InvoiceLineItem>
 */
class InvoiceLineItemFactory extends Factory
{
    public function definition(): array
    {
        $qty = fake()->randomFloat(2, 1, 10);
        $price = fake()->randomFloat(2, 30, 120);

        return [
            'invoice_id' => Invoice::factory(),
            'shift_id' => null,
            'service_type_id' => ServiceType::factory(),
            'description' => fake()->sentence(4),
            'support_item_number' => fake()->numerify('01_###_####_#_#'),
            'service_date' => fake()->dateTimeBetween('-1 month', 'now')->format('Y-m-d'),
            'quantity' => $qty,
            'unit_price' => $price,
            'line_total' => round($qty * $price, 2),
        ];
    }
}
