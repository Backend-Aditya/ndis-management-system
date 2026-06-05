<?php

use App\Models\NdisPlan;
use App\Models\Participant;
use App\Models\Tenant;
use App\Models\User;
use Database\Seeders\RoleSeeder;

beforeEach(function () {
    $this->withoutVite();
    $this->seed(RoleSeeder::class);
    $this->tenant = Tenant::factory()->create();
    $this->director = User::factory()->forTenant($this->tenant)->create();
    $this->director->assignRole('director');
    app()->instance('tenant', $this->tenant);
});

it('director can list plans scoped to tenant', function () {
    $participant = Participant::factory()->forTenant($this->tenant)->create();
    NdisPlan::factory()->forTenant($this->tenant)->forParticipant($participant)->count(2)->create();

    $other = Tenant::factory()->create();
    $otherParticipant = Participant::factory()->forTenant($other)->create();
    NdisPlan::factory()->forTenant($other)->forParticipant($otherParticipant)->create();

    $this->actingAs($this->director)
        ->get('/plans')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('plans/index')
            ->has('plans.data', 2));
});

it('director can create a plan', function () {
    $participant = Participant::factory()->forTenant($this->tenant)->create();

    $this->actingAs($this->director)
        ->post('/plans', [
            'participant_id' => $participant->id,
            'plan_start_date' => '2025-01-01',
            'plan_end_date' => '2026-01-01',
            'management_type' => 'agency_managed',
            'status' => 'active',
            'total_funding' => 50000,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('ndis_plans', [
        'participant_id' => $participant->id,
        'tenant_id' => $this->tenant->id,
    ]);
});

it('director can view plan show page', function () {
    $participant = Participant::factory()->forTenant($this->tenant)->create();
    $plan = NdisPlan::factory()->forTenant($this->tenant)->forParticipant($participant)->create();

    $this->actingAs($this->director)
        ->get("/plans/{$plan->id}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('plans/show'));
});
