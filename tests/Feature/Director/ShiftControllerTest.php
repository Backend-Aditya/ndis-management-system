<?php

use App\Models\Participant;
use App\Models\ServiceType;
use App\Models\Shift;
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

it('director can list shifts scoped to tenant', function () {
    Shift::factory()->forTenant($this->tenant)->count(3)->create();
    $other = Tenant::factory()->create();
    Shift::factory()->forTenant($other)->create();

    $this->actingAs($this->director)
        ->get('/shifts')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('scheduling/shifts/index')
            ->has('shifts.data', 3));
});

it('director can create a shift', function () {
    $participant = Participant::factory()->forTenant($this->tenant)->create();
    $staff = User::factory()->forTenant($this->tenant)->create();
    $serviceType = ServiceType::factory()->forTenant($this->tenant)->create();

    $this->actingAs($this->director)
        ->post('/shifts', [
            'participant_id' => $participant->id,
            'staff_id' => $staff->id,
            'service_type_id' => $serviceType->id,
            'scheduled_start' => now()->addDay()->toDateTimeString(),
            'scheduled_end' => now()->addDay()->addHours(4)->toDateTimeString(),
            'status' => 'scheduled',
            'requires_transport' => false,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('shifts', [
        'participant_id' => $participant->id,
        'tenant_id' => $this->tenant->id,
    ]);
});

it('director can cancel a shift', function () {
    $shift = Shift::factory()->forTenant($this->tenant)->create();

    $this->actingAs($this->director)
        ->post("/shifts/{$shift->id}/cancel", [
            'cancelled_by_type' => 'participant',
            'reason_code' => 'illness',
            'billable' => false,
        ])
        ->assertRedirect();

    expect($shift->fresh()->status)->toBe('cancelled');
    $this->assertDatabaseHas('shift_cancellations', ['shift_id' => $shift->id]);
});

it('director can add handover note', function () {
    $shift = Shift::factory()->forTenant($this->tenant)->create();
    $staff = User::factory()->forTenant($this->tenant)->create();

    $this->actingAs($this->director)
        ->post("/shifts/{$shift->id}/handover", [
            'staff_id' => $staff->id,
            'content' => 'All went well.',
            'status' => 'submitted',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('shift_handover_notes', ['shift_id' => $shift->id]);
});
