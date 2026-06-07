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

it('superadmin can update tenant status and director login', function () {
    $tenant = Tenant::factory()->create(['status' => 'active']);
    $director = User::factory()->forTenant($tenant)->create(['email' => 'old@org.com']);
    $director->assignRole('director');

    $this->actingAs($this->admin)
        ->put("/super-admin/tenants/{$tenant->id}", [
            'name' => $tenant->name, 'contact_email' => $tenant->contact_email,
            'plan' => $tenant->plan, 'status' => 'suspended',
            'director_first_name' => 'Updated', 'director_last_name' => 'Director',
            'director_email' => 'new@org.com', 'director_password' => 'newpassword123',
        ])
        ->assertRedirect();

    expect($tenant->fresh()->status)->toBe('suspended')
        ->and($director->fresh()->email)->toBe('new@org.com')
        ->and($director->fresh()->first_name)->toBe('Updated');
});

it('update creates a director when the organisation has none', function () {
    $tenant = Tenant::factory()->create(['status' => 'active']);

    $this->actingAs($this->admin)
        ->put("/super-admin/tenants/{$tenant->id}", [
            'name' => $tenant->name, 'contact_email' => $tenant->contact_email,
            'plan' => $tenant->plan, 'status' => 'active',
            'director_first_name' => 'Fresh', 'director_last_name' => 'Director',
            'director_email' => 'fresh@org.com', 'director_password' => 'password123',
        ])
        ->assertRedirect();

    $director = User::withoutGlobalScopes()->where('email', 'fresh@org.com')->first();
    expect($director)->not->toBeNull()
        ->and($director->tenant_id)->toBe($tenant->id)
        ->and($director->hasRole('director'))->toBeTrue();
});

it('update without password fails when creating a missing director', function () {
    $tenant = Tenant::factory()->create(['status' => 'active']);

    $this->actingAs($this->admin)
        ->put("/super-admin/tenants/{$tenant->id}", [
            'name' => $tenant->name, 'contact_email' => $tenant->contact_email,
            'plan' => $tenant->plan, 'status' => 'active',
            'director_first_name' => 'Fresh', 'director_last_name' => 'Director',
            'director_email' => 'fresh2@org.com', 'director_password' => '',
        ])
        ->assertSessionHasErrors('director_password');
});

it('edit page exposes the director account', function () {
    $tenant = Tenant::factory()->create();
    $director = User::factory()->forTenant($tenant)->create(['email' => 'dir@org.com']);
    $director->assignRole('director');

    $this->actingAs($this->admin)
        ->get("/super-admin/tenants/{$tenant->id}/edit")
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('super-admin/tenants/edit')
            ->where('director.email', 'dir@org.com'));
});

it('director cannot access super admin routes', function () {
    $tenant = Tenant::factory()->create();
    $director = User::factory()->forTenant($tenant)->create();
    $director->assignRole('director');
    $this->actingAs($director)->get('/super-admin/tenants')->assertForbidden();
});
