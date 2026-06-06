<?php

namespace Database\Factories;

use App\Models\Announcement;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Announcement> */
class AnnouncementFactory extends Factory
{
    public function definition(): array
    {
        return [
            'tenant_id' => Tenant::factory(),
            'created_by' => User::factory(),
            'title' => fake()->sentence(5),
            'content' => fake()->paragraphs(2, true),
            'audience' => fake()->randomElement(['all_staff', 'managers', 'participants', 'everyone']),
            'is_pinned' => false,
        ];
    }

    public function forTenant(Tenant $tenant): static
    {
        return $this->state(['tenant_id' => $tenant->id]);
    }

    public function pinned(): static
    {
        return $this->state(['is_pinned' => true]);
    }
}
