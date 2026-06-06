<?php

namespace Database\Factories;

use App\Models\LeaveRequest;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LeaveRequest>
 */
class LeaveRequestFactory extends Factory
{
    public function definition(): array
    {
        $start = fake()->dateTimeBetween('now', '+1 month');
        $end = (clone $start)->modify('+3 days');

        return [
            'tenant_id' => Tenant::factory(),
            'staff_id' => User::factory(),
            'leave_type' => fake()->randomElement(['annual', 'sick', 'personal', 'unpaid']),
            'start_date' => $start->format('Y-m-d'),
            'end_date' => $end->format('Y-m-d'),
            'hours' => fake()->randomFloat(2, 7.6, 38),
            'reason' => fake()->sentence(),
            'status' => 'pending',
            'approved_by' => null,
        ];
    }

    public function forTenant(Tenant $tenant): static
    {
        return $this->state(['tenant_id' => $tenant->id]);
    }

    public function approved(): static
    {
        return $this->state(['status' => 'approved']);
    }
}
