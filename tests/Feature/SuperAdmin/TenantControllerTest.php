<?php

use App\Models\Tenant;
use App\Models\User;
use Database\Seeders\RoleSeeder;

beforeEach(function () {
    $this->withoutVite();
    $this->seed(RoleSeeder::class);
    $this->admin = User::factory()->create(['tenant_id' => null]);
    $this->admin->assignRole('super_admin');
});

it('superadmin can list all tenants', function () {
    Tenant::factory()->count(3)->create();
    $this->actingAs($this->admin)
        ->get('/super-admin/tenants')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('super-admin/tenants/index')
            ->has('tenants.data', 3));
});

it('superadmin can create a tenant', function () {
    $this->actingAs($this->admin)
        ->post('/super-admin/tenants', [
            'name' => 'New NDIS Org', 'contact_email' => 'org@example.com',
            'plan' => 'starter', 'status' => 'active',
            'director_first_name' => 'Jane', 'director_last_name' => 'Director',
            'director_email' => 'director@newndisorg.com', 'director_password' => 'password123',
        ])
        ->assertRedirect('/super-admin/tenants');
    $this->assertDatabaseHas('tenants', ['name' => 'New NDIS Org']);
});

it('superadmin can update tenant status', function () {
    $tenant = Tenant::factory()->create(['status' => 'active']);
    $this->actingAs($this->admin)
        ->put("/super-admin/tenants/{$tenant->id}", [
            'name' => $tenant->name, 'contact_email' => $tenant->contact_email,
            'plan' => $tenant->plan, 'status' => 'suspended',
        ])
        ->assertRedirect();
    expect($tenant->fresh()->status)->toBe('suspended');
});

it('director cannot access super admin routes', function () {
    $tenant = Tenant::factory()->create();
    $director = User::factory()->forTenant($tenant)->create();
    $director->assignRole('director');
    $this->actingAs($director)->get('/super-admin/tenants')->assertForbidden();
});
