<?php

namespace App\Http\Controllers\Director;

use App\Http\Controllers\Controller;
use App\Http\Requests\Director\StoreIncidentFollowUpRequest;
use App\Http\Requests\Director\StoreIncidentRequest;
use App\Http\Resources\IncidentResource;
use App\Http\Resources\ParticipantResource;
use App\Models\Incident;
use App\Models\Participant;
use App\Services\IncidentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IncidentController extends Controller
{
    public function __construct(private readonly IncidentService $incidentService) {}

    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $incidents = Incident::with(['participant', 'reporter'])
            ->when($search, function ($q) use ($search) {
                $q->where('incident_type', 'like', "%{$search}%")
                    ->orWhere('severity', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%")
                    ->orWhereHas('participant', fn ($pq) => $pq->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%"));
            })
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('compliance/incidents/index', [
            'incidents' => IncidentResource::collection($incidents),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('compliance/incidents/create', [
            'participants' => ParticipantResource::collection(Participant::orderBy('last_name')->get()),
        ]);
    }

    public function store(StoreIncidentRequest $request): RedirectResponse
    {
        $incident = $this->incidentService->create($request->validated());

        return redirect()->route('incidents.show', $incident)->with('success', 'Incident reported.');
    }

    public function show(Incident $incident): Response
    {
        $incident->load(['participant', 'reporter', 'followUps']);

        return Inertia::render('compliance/incidents/show', [
            'incident' => IncidentResource::make($incident)->resolve(),
        ]);
    }

    public function destroy(Incident $incident): RedirectResponse
    {
        $incident->delete();

        return redirect()->route('incidents.index')->with('success', 'Incident removed.');
    }

    public function addFollowUp(StoreIncidentFollowUpRequest $request, Incident $incident): RedirectResponse
    {
        $this->incidentService->addFollowUp($incident, $request->validated());

        return back()->with('success', 'Follow-up added.');
    }
}
