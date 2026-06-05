<?php

namespace App\Http\Controllers\Director;

use App\Http\Controllers\Controller;
use App\Http\Requests\Director\StoreParticipantDiagnosisRequest;
use App\Models\Participant;
use App\Models\ParticipantDiagnosis;
use App\Services\ParticipantService;
use Illuminate\Http\RedirectResponse;

class ParticipantDiagnosisController extends Controller
{
    public function __construct(private readonly ParticipantService $participantService) {}

    public function store(StoreParticipantDiagnosisRequest $request, Participant $participant): RedirectResponse
    {
        $this->participantService->addDiagnosis($participant, $request->validated());

        return back()->with('success', 'Diagnosis added.');
    }

    public function destroy(Participant $participant, ParticipantDiagnosis $diagnosis): RedirectResponse
    {
        $diagnosis->delete();

        return back()->with('success', 'Diagnosis removed.');
    }
}
