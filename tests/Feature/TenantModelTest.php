<?php

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('creates a tenant with required fields', function () {
    $tenant = Tenant::factory()->create(['name' => 'Sunrise NDIS', 'status' => 'trialing']);

    expect($tenant->name)->toBe('Sunrise NDIS')
        ->and($tenant->slug)->not->toBeEmpty()
        ->and($tenant->status)->toBe('trialing');
});

it('tenant has many users', function () {
    $tenant = Tenant::factory()->create();
    User::factory()->count(3)->create(['tenant_id' => $tenant->id]);

    expect($tenant->users)->toHaveCount(3);
});

it('HasTenant global scope filters by current tenant', function () {
    $tenantA = Tenant::factory()->create();
    $tenantB = Tenant::factory()->create();

    app()->instance('tenant', $tenantA);

    // Create one user per tenant
    User::factory()->create(['tenant_id' => $tenantA->id]);
    User::factory()->create(['tenant_id' => $tenantB->id]);

    // HasTenant scope should only see tenantA's user
    expect(User::count())->toBe(1);
});
