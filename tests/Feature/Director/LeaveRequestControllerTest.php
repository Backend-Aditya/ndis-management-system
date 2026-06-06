<?php

use App\Models\LeaveRequest;
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

it('director can list leave requests scoped to tenant', function () {
    LeaveRequest::factory()->forTenant($this->tenant)->count(2)->create();
    $other = Tenant::factory()->create();
    LeaveRequest::factory()->forTenant($other)->create();

    $this->actingAs($this->director)
        ->get('/leave')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('scheduling/leave/index')
            ->has('leaveRequests.data', 2));
});

it('director can approve leave', function () {
    $leave = LeaveRequest::factory()->forTenant($this->tenant)->create(['status' => 'pending']);

    $this->actingAs($this->director)
        ->patch("/leave/{$leave->id}/approve")
        ->assertRedirect();

    expect($leave->fresh()->status)->toBe('approved');
});
