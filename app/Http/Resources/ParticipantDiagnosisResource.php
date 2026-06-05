<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class ParticipantDiagnosisResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'participant_id' => $this->participant_id,
            'diagnosis_name' => $this->diagnosis_name,
            'icd_10_code' => $this->icd_10_code,
            'diagnosed_date' => $this->diagnosed_date?->toDateString(),
            'is_primary' => $this->is_primary,
        ];
    }
}
