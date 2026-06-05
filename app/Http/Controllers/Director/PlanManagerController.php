<?php

namespace App\Http\Controllers\Director;

use App\Http\Controllers\Controller;
use App\Http\Requests\Director\StorePlanManagerRequest;
use App\Models\NdisPlan;
use App\Models\PlanManager;
use App\Services\PlanService;
use Illuminate\Http\RedirectResponse;

class PlanManagerController extends Controller
{
    public function __construct(private readonly PlanService $planService) {}

    public function store(StorePlanManagerRequest $request, NdisPlan $plan): RedirectResponse
    {
        $this->planService->addPlanManager($plan, $request->validated());

        return back()->with('success', 'Plan manager added.');
    }

    public function destroy(NdisPlan $plan, PlanManager $manager): RedirectResponse
    {
        $manager->delete();

        return back()->with('success', 'Plan manager removed.');
    }
}
