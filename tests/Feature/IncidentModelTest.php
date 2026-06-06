<?php

use App\Models\Audit;
use App\Models\BehaviourSupportPlan;
use App\Models\Incident;
use App\Models\IncidentFollowUp;
use App\Models\RiskAssessment;
use App\Models\Tenant;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->tenant = Tenant::factory()->create();
    app()->instance('tenant', $this->tenant);
});

it('incident scoped to tenant via HasTenant', function () {
    Incident::factory()->forTenant($this->tenant)->count(2)->create();
    $other = Tenant::factory()->create();
    Incident::factory()->forTenant($other)->create();

    expect(Incident::count())->toBe(2);
});

it('incident has follow ups', function () {
    $incident = Incident::factory()->forTenant($this->tenant)->create();
    IncidentFollowUp::factory()->count(2)->create(['incident_id' => $incident->id]);

    expect($incident->followUps)->toHaveCount(2);
});

it('risk assessment, BSP, audit scoped to tenant', function () {
    RiskAssessment::factory()->forTenant($this->tenant)->create();
    BehaviourSupportPlan::factory()->forTenant($this->tenant)->create();
    Audit::factory()->forTenant($this->tenant)->create();

    $other = Tenant::factory()->create();
    RiskAssessment::factory()->forTenant($other)->create();

    expect(RiskAssessment::count())->toBe(1)
        ->and(BehaviourSupportPlan::count())->toBe(1)
        ->and(Audit::count())->toBe(1);
});
