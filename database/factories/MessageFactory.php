<?php

namespace Database\Factories;

use App\Models\Message;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Message> */
class MessageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'tenant_id' => Tenant::factory(),
            'sender_id' => User::factory(),
            'subject' => fake()->sentence(4),
            'body' => fake()->paragraph(),
            'message_type' => fake()->randomElement(['general', 'urgent', 'reminder']),
            'is_broadcast' => false,
        ];
    }

    public function forTenant(Tenant $tenant): static
    {
        return $this->state(['tenant_id' => $tenant->id]);
    }

    public function broadcast(): static
    {
        return $this->state(['is_broadcast' => true]);
    }
}
