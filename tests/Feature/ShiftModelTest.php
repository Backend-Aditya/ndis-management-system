<?php

use App\Models\LeaveRequest;
use App\Models\Shift;
use App\Models\Tenant;
use Database\Seeders\RoleSeeder;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->tenant = Tenant::factory()->create();
    app()->instance('tenant', $this->tenant);
});

it('shift scoped to tenant via HasTenant', function () {
    Shift::factory()->forTenant($this->tenant)->count(2)->create();
    $other = Tenant::factory()->create();
    Shift::factory()->forTenant($other)->create();

    expect(Shift::count())->toBe(2);
});

it('shift has participant, staff, service type relationships', function () {
    $shift = Shift::factory()->forTenant($this->tenant)->create();

    expect($shift->participant)->not->toBeNull()
        ->and($shift->staff)->not->toBeNull()
        ->and($shift->serviceType)->not->toBeNull();
});

it('leave request scoped to tenant', function () {
    LeaveRequest::factory()->forTenant($this->tenant)->count(2)->create();
    $other = Tenant::factory()->create();
    LeaveRequest::factory()->forTenant($other)->create();

    expect(LeaveRequest::count())->toBe(2);
});
