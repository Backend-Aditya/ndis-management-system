<?php

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

it('director can list staff in their tenant', function () {
    User::factory()->forTenant($this->tenant)->count(3)->create()->each->assignRole('staff_worker');
    $other = Tenant::factory()->create();
    User::factory()->forTenant($other)->create()->assignRole('staff_worker');

    $this->actingAs($this->director)
        ->get('/staff')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('staff/index')
            ->has('staff.data', 4)); // 3 staff_workers + 1 director
});

it('director can invite a new staff member', function () {
    $this->actingAs($this->director)
        ->post('/staff', [
            'first_name' => 'Alice', 'last_name' => 'Smith',
            'email' => 'alice@example.com',
            'password' => 'password', 'password_confirmation' => 'password',
            'role' => 'staff_worker', 'position' => 'Support Worker',
            'employment_type' => 'casual', 'hourly_rate' => '32.50',
        ])
        ->assertRedirect('/staff');
    $this->assertDatabaseHas('users', ['email' => 'alice@example.com', 'tenant_id' => $this->tenant->id]);
    $this->assertDatabaseHas('staff_profiles', ['position' => 'Support Worker']);
});

it('new staff belongs to current tenant', function () {
    $this->actingAs($this->director)
        ->post('/staff', [
            'first_name' => 'Bob', 'last_name' => 'Jones',
            'email' => 'bob@example.com',
            'password' => 'password', 'password_confirmation' => 'password',
            'role' => 'staff_worker',
        ]);
    $user = User::withoutGlobalScopes()->where('email', 'bob@example.com')->first();
    expect($user?->tenant_id)->toBe($this->tenant->id);
});
