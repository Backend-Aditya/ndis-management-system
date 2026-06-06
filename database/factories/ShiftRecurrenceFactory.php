<?php

namespace Database\Factories;

use App\Models\Shift;
use App\Models\ShiftRecurrence;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ShiftRecurrence>
 */
class ShiftRecurrenceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'shift_id' => Shift::factory(),
            'rrule' => 'FREQ=WEEKLY;BYDAY=MO,WE,FR',
            'recurrence_end' => fake()->dateTimeBetween('+1 month', '+6 months')->format('Y-m-d'),
            'occurrences_generated' => 0,
        ];
    }
}
