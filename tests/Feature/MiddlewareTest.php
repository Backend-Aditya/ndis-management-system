<?php

use App\Models\Tenant;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

it('ResolveTenant sets tenant in container from authenticated user', function () {
    $tenant = Tenant::factory()->create();
    $user = User::factory()->forTenant($tenant)->create();

    $this->actingAs($user)->get('/dashboard');

    expect(app()->has('tenant'))->toBeTrue()
        ->and(app('tenant')->id)->toBe($tenant->id);
});

it('RequireSuperAdmin blocks non-super-admin users', function () {
    $tenant = Tenant::factory()->create();
    $user = User::factory()->forTenant($tenant)->create();
    $user->assignRole('director');

    $this->actingAs($user)
        ->get('/super-admin/tenants')
        ->assertForbidden();
});
