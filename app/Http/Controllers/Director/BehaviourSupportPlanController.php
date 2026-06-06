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
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BehaviourSupportPlanController extends Controller
{
    public function __construct(private readonly ComplianceService $complianceService) {}

    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $plans = BehaviourSupportPlan::with('participant')
            ->when($search, function ($q) use ($search) {
                $q->where('status', 'like', "%{$search}%")
                    ->orWhere('restrictive_practice_type', 'like', "%{$search}%")
                    ->orWhereHas('participant', fn ($pq) => $pq->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%"));
            })
            ->latest()
            ->paginate(25)
            ->withQueryString();

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
