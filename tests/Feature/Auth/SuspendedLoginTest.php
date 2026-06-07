<?php

use App\Models\Tenant;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Support\Facades\Hash;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

it('blocks login when the organisation is suspended', function () {
    $tenant = Tenant::factory()->create(['status' => 'suspended']);
    $director = User::factory()->forTenant($tenant)->create([
        'email' => 'dir@suspended.com',
        'password' => Hash::make('password123'),
    ]);
    $director->assignRole('director');

    $this->post('/login', [
        'email' => 'dir@suspended.com',
        'password' => 'password123',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();
});

it('blocks login when the account is deactivated', function () {
    $tenant = Tenant::factory()->create(['status' => 'active']);
    $user = User::factory()->forTenant($tenant)->create([
        'email' => 'inactive@org.com',
        'password' => Hash::make('password123'),
        'is_active' => false,
    ]);
    $user->assignRole('staff_worker');

    $this->post('/login', [
        'email' => 'inactive@org.com',
        'password' => 'password123',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();
});

it('allows login when the organisation is active', function () {
    $tenant = Tenant::factory()->create(['status' => 'active']);
    $director = User::factory()->forTenant($tenant)->create([
        'email' => 'dir@active.com',
        'password' => Hash::make('password123'),
    ]);
    $director->assignRole('director');

    $this->post('/login', [
        'email' => 'dir@active.com',
        'password' => 'password123',
    ]);

    $this->assertAuthenticatedAs($director);
});
