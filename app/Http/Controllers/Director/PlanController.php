<?php

namespace App\Http\Controllers\Director;

use App\Http\Controllers\Controller;
use App\Http\Requests\Director\StoreNdisPlanRequest;
use App\Http\Requests\Director\UpdateNdisPlanRequest;
use App\Http\Resources\NdisPlanResource;
use App\Http\Resources\ParticipantResource;
use App\Models\NdisPlan;
use App\Models\Participant;
use App\Services\PlanService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PlanController extends Controller
{
    public function __construct(private readonly PlanService $planService) {}

    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $plans = NdisPlan::with('participant')
            ->when($search, function ($q) use ($search) {
                $q->where('plan_number', 'like', "%{$search}%")
                    ->orWhereHas('participant', fn ($pq) => $pq->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%"));
            })
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('plans/index', [
            'plans' => NdisPlanResource::collection($plans),
        ]);
    }

    public function create(): Response
    {
        $participants = Participant::orderBy('last_name')->get(['id', 'first_name', 'last_name', 'ndis_number']);

        return Inertia::render('plans/create', [
            'participants' => ParticipantResource::collection($participants),
        ]);
    }

    public function store(StoreNdisPlanRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $participant = Participant::findOrFail($data['participant_id']);
        $plan = $this->planService->create($participant, $data);

        return redirect()->route('plans.show', $plan)
            ->with('success', 'NDIS plan created.');
    }

    public function show(NdisPlan $plan): Response
    {
        $plan->load(['participant', 'supportCategories.items', 'managers']);

        return Inertia::render('plans/show', [
            'plan' => NdisPlanResource::make($plan)->resolve(),
        ]);
    }

    public function edit(NdisPlan $plan): Response
    {
        return Inertia::render('plans/edit', [
            'plan' => NdisPlanResource::make($plan)->resolve(),
        ]);
    }

    public function update(UpdateNdisPlanRequest $request, NdisPlan $plan): RedirectResponse
    {
        $this->planService->update($plan, $request->validated());

        return redirect()->route('plans.show', $plan)
            ->with('success', 'Plan updated.');
    }

    public function destroy(NdisPlan $plan): RedirectResponse
    {
        $plan->delete();

        return redirect()->route('plans.index')
            ->with('success', 'Plan removed.');
    }
}
