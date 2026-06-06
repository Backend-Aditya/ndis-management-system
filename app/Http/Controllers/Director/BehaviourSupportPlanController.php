<?php

namespace App\Http\Controllers\Director;

use App\Http\Controllers\Controller;
use App\Http\Requests\Director\StoreBehaviourSupportPlanRequest;
use App\Http\Resources\BehaviourSupportPlanResource;
use App\Http\Resources\ParticipantResource;
use App\Models\BehaviourSupportPlan;
use App\Models\Participant;
use App\Services\ComplianceService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BehaviourSupportPlanController extends Controller
{
    public function __construct(private readonly ComplianceService $complianceService) {}

    public function index(): Response
    {
        $plans = BehaviourSupportPlan::with('participant')->latest()->paginate(25);

        return Inertia::render('compliance/behaviour-support-plans/index', [
            'plans' => BehaviourSupportPlanResource::collection($plans),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('compliance/behaviour-support-plans/create', [
            'participants' => ParticipantResource::collection(Participant::orderBy('last_name')->get()),
        ]);
    }

    public function store(StoreBehaviourSupportPlanRequest $request): RedirectResponse
    {
        $this->complianceService->createBehaviourSupportPlan($request->validated());

        return redirect()->route('behaviour-support-plans.index')->with('success', 'Behaviour support plan created.');
    }

    public function destroy(BehaviourSupportPlan $behaviourSupportPlan): RedirectResponse
    {
        $behaviourSupportPlan->delete();

        return back()->with('success', 'Plan removed.');
    }
}
