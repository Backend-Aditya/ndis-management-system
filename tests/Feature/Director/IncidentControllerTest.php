<?php

use App\Models\Incident;
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

it('director can list incidents scoped to tenant', function () {
    Incident::factory()->forTenant($this->tenant)->count(3)->create();
    $other = Tenant::factory()->create();
    Incident::factory()->forTenant($other)->create();

    $this->actingAs($this->director)
        ->get('/incidents')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('compliance/incidents/index')
            ->has('incidents.data', 3));
});

it('director can report an incident', function () {
    $participant = Participant::factory()->forTenant($this->tenant)->create();

    $this->actingAs($this->director)
        ->post('/incidents', [
            'participant_id' => $participant->id,
            'incident_type' => 'injury',
            'severity' => 'high',
            'occurred_at' => now()->toDateTimeString(),
            'description' => 'Fall in bathroom.',
            'status' => 'open',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('incidents', [
        'participant_id' => $participant->id,
        'tenant_id' => $this->tenant->id,
        'reported_by' => $this->director->id,
    ]);
});

it('director can add follow up to incident', function () {
    $incident = Incident::factory()->forTenant($this->tenant)->create();
    $staff = User::factory()->forTenant($this->tenant)->create();

    $this->actingAs($this->director)
        ->post("/incidents/{$incident->id}/follow-ups", [
            'staff_id' => $staff->id,
            'action_taken' => 'Reviewed with team.',
            'is_resolved' => true,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('incident_follow_ups', ['incident_id' => $incident->id]);
});
