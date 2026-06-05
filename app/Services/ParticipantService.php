<?php

namespace App\Services;

use App\Models\Participant;
use App\Models\ParticipantContact;
use App\Models\ParticipantDiagnosis;
use App\Models\ParticipantGoal;

class ParticipantService
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Participant
    {
        return Participant::create([
            ...$data,
            'tenant_id' => app('tenant')->id,
        ]);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Participant $participant, array $data): Participant
    {
        $participant->update($data);

        return $participant->fresh();
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function addContact(Participant $participant, array $data): ParticipantContact
    {
        return $participant->contacts()->create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function updateContact(ParticipantContact $contact, array $data): ParticipantContact
    {
        $contact->update($data);

        return $contact->fresh();
    }

    public function deleteContact(ParticipantContact $contact): void
    {
        $contact->delete();
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function addGoal(Participant $participant, array $data): ParticipantGoal
    {
        return $participant->goals()->create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function updateGoal(ParticipantGoal $goal, array $data): ParticipantGoal
    {
        $goal->update($data);

        return $goal->fresh();
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function addDiagnosis(Participant $participant, array $data): ParticipantDiagnosis
    {
        return $participant->diagnoses()->create($data);
    }
}
