<?php

namespace App\Http\Controllers\Director;

use App\Http\Controllers\Controller;
use App\Http\Requests\Director\StorePlanSupportCategoryRequest;
use App\Models\NdisPlan;
use App\Models\PlanSupportCategory;
use App\Services\PlanService;
use Illuminate\Http\RedirectResponse;

class PlanSupportCategoryController extends Controller
{
    public function __construct(private readonly PlanService $planService) {}

    public function store(StorePlanSupportCategoryRequest $request, NdisPlan $plan): RedirectResponse
    {
        $this->planService->addSupportCategory($plan, $request->validated());

        return back()->with('success', 'Support category added.');
    }

    public function destroy(NdisPlan $plan, PlanSupportCategory $category): RedirectResponse
    {
        $category->delete();

        return back()->with('success', 'Support category removed.');
    }
}
