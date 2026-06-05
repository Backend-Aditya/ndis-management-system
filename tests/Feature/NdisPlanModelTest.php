<?php

use App\Models\NdisPlan;
use App\Models\Participant;
use App\Models\ServiceType;
use App\Models\Tenant;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->tenant = Tenant::factory()->create();
    app()->instance('tenant', $this->tenant);
});

it('ndis plan scoped to tenant via HasTenant', function () {
    $participant = Participant::factory()->forTenant($this->tenant)->create();
    NdisPlan::factory()->forTenant($this->tenant)->forParticipant($participant)->count(2)->create();

    $other = Tenant::factory()->create();
    $otherParticipant = Participant::factory()->forTenant($other)->create();
    NdisPlan::factory()->forTenant($other)->forParticipant($otherParticipant)->create();

    expect(NdisPlan::count())->toBe(2);
});

it('service type scoped to tenant', function () {
    ServiceType::factory()->forTenant($this->tenant)->count(3)->create();
    $other = Tenant::factory()->create();
    ServiceType::factory()->forTenant($other)->create();

    expect(ServiceType::count())->toBe(3);
});

it('ndis plan belongs to participant', function () {
    $participant = Participant::factory()->forTenant($this->tenant)->create();
    $plan = NdisPlan::factory()->forTenant($this->tenant)->forParticipant($participant)->create();

    expect($plan->participant->id)->toBe($participant->id);
});
