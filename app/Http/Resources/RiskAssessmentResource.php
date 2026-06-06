<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class RiskAssessmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'participant_id' => $this->participant_id,
            'risk_area' => $this->risk_area,
            'risk_description' => $this->risk_description,
            'likelihood' => $this->likelihood,
            'impact' => $this->impact,
            'risk_level' => $this->risk_level,
            'mitigation_strategies' => $this->mitigation_strategies,
            'review_date' => $this->review_date?->toDateString(),
            'participant' => $this->whenLoaded('participant', fn () => [
                'id' => $this->participant->id,
                'full_name' => $this->participant->full_name,
            ]),
        ];
    }
}
