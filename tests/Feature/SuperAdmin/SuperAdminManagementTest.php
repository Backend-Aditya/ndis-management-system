<?php

use App\Models\Tenant;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    $this->withoutVite();
    $this->seed(RoleSeeder::class);
    $this->admin = User::factory()->create(['tenant_id' => null]);
    $this->admin->assignRole('super_admin');
});

it('superadmin creates organisation with director login', function () {
    $this->actingAs($this->admin)
        ->post('/super-admin/tenants', [
            'name' => 'Bright Care',
            'contact_email' => 'org@bright.com',
            'plan' => 'starter',
            'status' => 'active',
            'director_first_name' => 'Dana',
            'director_last_name' => 'Director',
            'director_email' => 'dana@bright.com',
            'director_password' => 'password123',
        ])
        ->assertRedirect('/super-admin/tenants');

    $this->assertDatabaseHas('tenants', ['name' => 'Bright Care']);
    $tenant = Tenant::withoutGlobalScopes()->where('name', 'Bright Care')->first();
    $director = User::withoutGlobalScopes()->where('email', 'dana@bright.com')->first();
    expect($director)->not->toBeNull()
        ->and($director->tenant_id)->toBe($tenant->id)
        ->and($director->hasRole('director'))->toBeTrue();
});

it('superadmin can add platform admin', function () {
    $this->actingAs($this->admin)
        ->post('/super-admin/platform-admins', [
            'first_name' => 'Pat', 'last_name' => 'Admin',
            'email' => 'pat@platform.com', 'password' => 'password123',
        ])
        ->assertRedirect('/super-admin/platform-admins');

    $user = User::withoutGlobalScopes()->where('email', 'pat@platform.com')->first();
    expect($user)->not->toBeNull()
        ->and($user->tenant_id)->toBeNull()
        ->and($user->hasRole('super_admin'))->toBeTrue();
});

it('superadmin can list platform admins', function () {
    $this->actingAs($this->admin)
        ->get('/super-admin/platform-admins')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('super-admin/platform-admins/index'));
});

it('superadmin can create a custom role with permissions', function () {
    $this->actingAs($this->admin)
        ->post('/super-admin/roles', [
            'name' => 'auditor',
            'permissions' => ['participant.view', 'compliance.view'],
        ])
        ->assertRedirect();

    $role = Role::findByName('auditor');
    expect($role->hasPermissionTo('participant.view'))->toBeTrue();
});

it('superadmin can update role permissions', function () {
    $role = Role::create(['name' => 'reviewer', 'guard_name' => 'web']);

    $this->actingAs($this->admin)
        ->put("/super-admin/roles/{$role->id}", [
            'name' => 'reviewer',
            'permissions' => ['incident.view'],
        ])
        ->assertRedirect();

    expect($role->fresh()->hasPermissionTo('incident.view'))->toBeTrue();
});

it('core roles cannot be deleted', function () {
    $role = Role::findByName('director');

    $this->actingAs($this->admin)
        ->delete("/super-admin/roles/{$role->id}")
        ->assertRedirect();

    expect(Role::where('name', 'director')->exists())->toBeTrue();
});

it('superadmin can create a permission', function () {
    $this->actingAs($this->admin)
        ->post('/super-admin/permissions', ['name' => 'report.export'])
        ->assertRedirect();

    expect(Permission::where('name', 'report.export')->exists())->toBeTrue();
});

it('director cannot access platform admin routes', function () {
    $tenant = Tenant::factory()->create();
    $director = User::factory()->forTenant($tenant)->create();
    $director->assignRole('director');

    $this->actingAs($director)
        ->get('/super-admin/platform-admins')
        ->assertForbidden();
});
