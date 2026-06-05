<?php

use App\Models\StaffProfile;
use App\Models\Tenant;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->tenant = Tenant::factory()->create();
    $this->director = User::factory()->forTenant($this->tenant)->create();
    $this->director->assignRole('director');
    app()->instance('tenant', $this->tenant);
});

it('director can view staff profiles scoped to tenant', function () {
    StaffProfile::factory()->count(2)->create([
        'user_id' => User::factory()->forTenant($this->tenant)->create()->id,
        'tenant_id' => $this->tenant->id,
    ]);

    $otherTenant = Tenant::factory()->create();
    StaffProfile::factory()->create([
        'user_id' => User::factory()->forTenant($otherTenant)->create()->id,
        'tenant_id' => $otherTenant->id,
    ]);

    // HasTenant scope active — should only see 2
    expect(StaffProfile::count())->toBe(2);
});

it('staff profile belongs to user and tenant', function () {
    $user = User::factory()->forTenant($this->tenant)->create();
    $profile = StaffProfile::factory()->create([
        'user_id' => $user->id,
        'tenant_id' => $this->tenant->id,
    ]);

    expect($profile->user->id)->toBe($user->id)
        ->and($profile->tenant->id)->toBe($this->tenant->id);
});
