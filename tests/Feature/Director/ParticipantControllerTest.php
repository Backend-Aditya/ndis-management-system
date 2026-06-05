<?php

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

it('director can list participants scoped to tenant', function () {
    Participant::factory()->forTenant($this->tenant)->count(3)->create();
    $other = Tenant::factory()->create();
    Participant::factory()->forTenant($other)->create();

    $this->actingAs($this->director)
        ->get('/participants')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('participants/index')
            ->has('participants.data', 3));
});

it('director can create participant', function () {
    $this->actingAs($this->director)
        ->post('/participants', [
            'ndis_number' => '4312345678',
            'first_name' => 'Jane', 'last_name' => 'Doe',
            'date_of_birth' => '1990-01-15',
            'participant_status' => 'active',
            'interpreter_required' => false,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('participants', ['ndis_number' => '4312345678', 'tenant_id' => $this->tenant->id]);
});

it('director can view participant show page', function () {
    $participant = Participant::factory()->forTenant($this->tenant)->create();

    $this->actingAs($this->director)
        ->get("/participants/{$participant->id}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('participants/show'));
});

it('director can add contact to participant', function () {
    $participant = Participant::factory()->forTenant($this->tenant)->create();

    $this->actingAs($this->director)
        ->post("/participants/{$participant->id}/contacts", [
            'first_name' => 'Bob', 'last_name' => 'Smith',
            'is_emergency' => true, 'is_authorised_rep' => false,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('participant_contacts', ['participant_id' => $participant->id, 'first_name' => 'Bob']);
});

it('staff from other tenant cannot access participants', function () {
    $other = Tenant::factory()->create();
    $otherUser = User::factory()->forTenant($other)->create();
    $otherUser->assignRole('director');

    Participant::factory()->forTenant($this->tenant)->create();

    app()->instance('tenant', $other);
    $this->actingAs($otherUser)
        ->get('/participants')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('participants.data', 0));
});
