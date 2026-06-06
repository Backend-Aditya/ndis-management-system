<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class BehaviourSupportPlanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'participant_id' => $this->participant_id,
            'plan_date' => $this->plan_date?->toDateString(),
            'review_date' => $this->review_date?->toDateString(),
            'triggers' => $this->triggers,
            'strategies' => $this->strategies,
            'uses_restrictive_practices' => $this->uses_restrictive_practices,
            'restrictive_practice_type' => $this->restrictive_practice_type,
            'status' => $this->status,
            'participant' => $this->whenLoaded('participant', fn () => [
                'id' => $this->participant->id,
                'full_name' => $this->participant->full_name,
            ]),
        ];
    }
}
