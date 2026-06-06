<?php

use App\Models\Participant;
use App\Models\RiskAssessment;
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

it('director can create risk assessment', function () {
    $participant = Participant::factory()->forTenant($this->tenant)->create();

    $this->actingAs($this->director)
        ->post('/risk-assessments', [
            'participant_id' => $participant->id,
            'risk_area' => 'mobility',
            'risk_description' => 'Falls risk.',
            'likelihood' => 'possible',
            'impact' => 'major',
            'risk_level' => 'high',
        ])
        ->assertRedirect('/risk-assessments');

    $this->assertDatabaseHas('risk_assessments', ['participant_id' => $participant->id, 'tenant_id' => $this->tenant->id]);
});

it('director can record an audit', function () {
    $this->actingAs($this->director)
        ->post('/audits', [
            'audit_type' => 'certification',
            'auditor_name' => 'Jane Auditor',
            'audit_date' => now()->toDateString(),
            'status' => 'completed',
        ])
        ->assertRedirect('/audits');

    $this->assertDatabaseHas('audits', ['auditor_name' => 'Jane Auditor', 'tenant_id' => $this->tenant->id]);
});

it('risk assessments list scoped to tenant', function () {
    RiskAssessment::factory()->forTenant($this->tenant)->count(2)->create();
    $other = Tenant::factory()->create();
    RiskAssessment::factory()->forTenant($other)->create();

    $this->actingAs($this->director)
        ->get('/risk-assessments')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('assessments.data', 2));
});
