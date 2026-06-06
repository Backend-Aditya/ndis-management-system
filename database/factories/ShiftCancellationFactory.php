<?php

namespace Database\Factories;

use App\Models\Shift;
use App\Models\ShiftCancellation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ShiftCancellation>
 */
class ShiftCancellationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'shift_id' => Shift::factory(),
            'cancelled_by_type' => fake()->randomElement(['participant', 'provider']),
            'cancelled_by_user' => User::factory(),
            'reason_code' => fake()->randomElement(['illness', 'no_show', 'staff_unavailable']),
            'reason_notes' => fake()->sentence(),
            'billable' => false,
        ];
    }
}
