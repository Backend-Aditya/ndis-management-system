<?php

namespace App\Http\Controllers\Director;

use App\Http\Controllers\Controller;
use App\Http\Requests\Director\StoreParticipantGoalRequest;
use App\Models\Participant;
use App\Models\ParticipantGoal;
use App\Services\ParticipantService;
use Illuminate\Http\RedirectResponse;

class ParticipantGoalController extends Controller
{
    public function __construct(private readonly ParticipantService $participantService) {}

    public function store(StoreParticipantGoalRequest $request, Participant $participant): RedirectResponse
    {
        $this->participantService->addGoal($participant, $request->validated());

        return back()->with('success', 'Goal added.');
    }

    public function destroy(Participant $participant, ParticipantGoal $goal): RedirectResponse
    {
        $goal->delete();

        return back()->with('success', 'Goal removed.');
    }
}
