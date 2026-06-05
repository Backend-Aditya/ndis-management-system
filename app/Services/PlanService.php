<?php

namespace App\Services;

use App\Models\NdisPlan;
use App\Models\Participant;
use App\Models\PlanManager;
use App\Models\PlanSupportCategory;

class PlanService
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function create(Participant $participant, array $data): NdisPlan
    {
        return NdisPlan::create([
            ...$data,
            'tenant_id' => app('tenant')->id,
            'participant_id' => $participant->id,
        ]);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(NdisPlan $plan, array $data): NdisPlan
    {
        $plan->update($data);

        return $plan->fresh();
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function addSupportCategory(NdisPlan $plan, array $data): PlanSupportCategory
    {
        return $plan->supportCategories()->create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function addPlanManager(NdisPlan $plan, array $data): PlanManager
    {
        return $plan->managers()->create($data);
    }
}
