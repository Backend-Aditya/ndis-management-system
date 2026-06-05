<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class ParticipantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ndis_number' => $this->ndis_number,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'date_of_birth' => $this->date_of_birth?->toDateString(),
            'gender' => $this->gender,
            'pronouns' => $this->pronouns,
            'address' => $this->address,
            'suburb' => $this->suburb,
            'state' => $this->state,
            'postcode' => $this->postcode,
            'primary_language' => $this->primary_language,
            'interpreter_required' => $this->interpreter_required,
            'communication_needs' => $this->communication_needs,
            'cultural_background' => $this->cultural_background,
            'participant_status' => $this->participant_status,
            'created_at' => $this->created_at->toISOString(),
            'contacts' => ParticipantContactResource::collection($this->whenLoaded('contacts')),
            'goals' => ParticipantGoalResource::collection($this->whenLoaded('goals')),
            'diagnoses' => ParticipantDiagnosisResource::collection($this->whenLoaded('diagnoses')),
        ];
    }
}
