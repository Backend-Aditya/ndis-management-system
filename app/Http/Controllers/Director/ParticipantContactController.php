<?php

namespace App\Http\Controllers\Director;

use App\Http\Controllers\Controller;
use App\Http\Requests\Director\StoreParticipantContactRequest;
use App\Models\Participant;
use App\Models\ParticipantContact;
use App\Services\ParticipantService;
use Illuminate\Http\RedirectResponse;

class ParticipantContactController extends Controller
{
    public function __construct(private readonly ParticipantService $participantService) {}

    public function store(StoreParticipantContactRequest $request, Participant $participant): RedirectResponse
    {
        $this->participantService->addContact($participant, $request->validated());

        return back()->with('success', 'Contact added.');
    }

    public function destroy(Participant $participant, ParticipantContact $contact): RedirectResponse
    {
        $this->participantService->deleteContact($contact);

        return back()->with('success', 'Contact removed.');
    }
}
