<?php

use App\Models\ServiceType;
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

it('director can list service types scoped to tenant', function () {
    ServiceType::factory()->forTenant($this->tenant)->count(3)->create();
    $other = Tenant::factory()->create();
    ServiceType::factory()->forTenant($other)->create();

    $this->actingAs($this->director)
        ->get('/service-types')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('services/service-types/index')
            ->has('serviceTypes.data', 3));
});

it('director can create service type', function () {
    $this->actingAs($this->director)
        ->post('/service-types', [
            'name' => 'Daily Activities Support',
            'standard_rate' => 67.56,
            'unit_of_measure' => 'H',
            'is_active' => true,
        ])
        ->assertRedirect('/service-types');

    $this->assertDatabaseHas('service_types', [
        'name' => 'Daily Activities Support',
        'tenant_id' => $this->tenant->id,
    ]);
});
