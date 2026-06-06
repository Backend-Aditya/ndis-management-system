<?php

namespace App\Http\Controllers\Director;

use App\Http\Controllers\Controller;
use App\Http\Requests\Director\StoreParticipantRequest;
use App\Http\Requests\Director\UpdateParticipantRequest;
use App\Http\Resources\ParticipantResource;
use App\Models\Participant;
use App\Services\ParticipantService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ParticipantController extends Controller
{
    public function __construct(private readonly ParticipantService $participantService) {}

    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $participants = Participant::query()
            ->when($search, function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('ndis_number', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('participants/index', [
            'participants' => ParticipantResource::collection($participants),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('participants/create');
    }

    public function store(StoreParticipantRequest $request): RedirectResponse
    {
        $participant = $this->participantService->create($request->validated());

        return redirect()->route('participants.show', $participant)
            ->with('success', 'Participant created.');
    }

    public function show(Participant $participant): Response
    {
        $participant->load(['contacts', 'goals', 'diagnoses', 'supportCoordinators.staff']);

        return Inertia::render('participants/show', [
            'participant' => ParticipantResource::make($participant)->resolve(),
        ]);
    }

    public function edit(Participant $participant): Response
    {
        return Inertia::render('participants/edit', [
            'participant' => ParticipantResource::make($participant)->resolve(),
        ]);
    }

    public function update(UpdateParticipantRequest $request, Participant $participant): RedirectResponse
    {
        $this->participantService->update($participant, $request->validated());

        return redirect()->route('participants.show', $participant)
            ->with('success', 'Participant updated.');
    }

    public function destroy(Participant $participant): RedirectResponse
    {
        $participant->delete();

        return redirect()->route('participants.index')
            ->with('success', 'Participant removed.');
    }
}
