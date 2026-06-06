<?php

namespace Database\Factories;

use App\Models\Participant;
use App\Models\ServiceType;
use App\Models\Shift;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Shift>
 */
class ShiftFactory extends Factory
{
    public function definition(): array
    {
        $start = fake()->dateTimeBetween('now', '+2 weeks');
        $end = (clone $start)->modify('+4 hours');

        return [
            'tenant_id' => Tenant::factory(),
            'participant_id' => Participant::factory(),
            'staff_id' => User::factory(),
            'service_type_id' => ServiceType::factory(),
            'scheduled_start' => $start,
            'scheduled_end' => $end,
            'actual_start' => null,
            'actual_end' => null,
            'status' => 'scheduled',
            'location' => fake()->address(),
            'requires_transport' => false,
            'kms_travelled' => null,
            'notes' => null,
        ];
    }

    public function forTenant(Tenant $tenant): static
    {
        return $this->state([
            'tenant_id' => $tenant->id,
            'participant_id' => Participant::factory()->forTenant($tenant),
            'service_type_id' => ServiceType::factory()->forTenant($tenant),
        ]);
    }

    public function completed(): static
    {
        return $this->state(['status' => 'completed']);
    }

    public function cancelled(): static
    {
        return $this->state(['status' => 'cancelled']);
    }
}
