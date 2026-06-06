<?php

namespace App\Services;

use App\Models\Audit;
use App\Models\BehaviourSupportPlan;
use App\Models\RiskAssessment;

class ComplianceService
{
    /** @param array<string, mixed> $data */
    public function createRiskAssessment(array $data): RiskAssessment
    {
        return RiskAssessment::create([...$data, 'tenant_id' => app('tenant')->id]);
    }

    /** @param array<string, mixed> $data */
    public function updateRiskAssessment(RiskAssessment $assessment, array $data): RiskAssessment
    {
        $assessment->update($data);

        return $assessment->fresh();
    }

    /** @param array<string, mixed> $data */
    public function createBehaviourSupportPlan(array $data): BehaviourSupportPlan
    {
        return BehaviourSupportPlan::create([...$data, 'tenant_id' => app('tenant')->id]);
    }

    /** @param array<string, mixed> $data */
    public function updateBehaviourSupportPlan(BehaviourSupportPlan $plan, array $data): BehaviourSupportPlan
    {
        $plan->update($data);

        return $plan->fresh();
    }

    /** @param array<string, mixed> $data */
    public function createAudit(array $data): Audit
    {
        return Audit::create([...$data, 'tenant_id' => app('tenant')->id]);
    }
}
