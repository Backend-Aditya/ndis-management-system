<?php

namespace Database\Factories;

use App\Models\Shift;
use App\Models\ShiftHandoverNote;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ShiftHandoverNote>
 */
class ShiftHandoverNoteFactory extends Factory
{
    public function definition(): array
    {
        return [
            'shift_id' => Shift::factory(),
            'staff_id' => User::factory(),
            'content' => fake()->paragraph(),
            'status' => 'submitted',
            'submitted_at' => now(),
            'reviewed_by' => null,
        ];
    }
}
