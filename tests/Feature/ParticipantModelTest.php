<?php

use App\Models\Participant;
use App\Models\ParticipantContact;
use App\Models\Tenant;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->tenant = Tenant::factory()->create();
    app()->instance('tenant', $this->tenant);
});

it('participant scoped to tenant via HasTenant', function () {
    Participant::factory()->forTenant($this->tenant)->count(2)->create();
    $other = Tenant::factory()->create();
    Participant::factory()->forTenant($other)->create();

    expect(Participant::count())->toBe(2);
});

it('participant full name accessor works', function () {
    $p = Participant::factory()->forTenant($this->tenant)->create([
        'first_name' => 'John', 'last_name' => 'Smith',
    ]);
    expect($p->full_name)->toBe('John Smith');
});

it('participant has contacts relationship', function () {
    $p = Participant::factory()->forTenant($this->tenant)->create();
    ParticipantContact::factory()->count(2)->create(['participant_id' => $p->id]);
    expect($p->contacts)->toHaveCount(2);
});
