<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class IncidentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'participant_id' => $this->participant_id,
            'reported_by' => $this->reported_by,
            'shift_id' => $this->shift_id,
            'incident_type' => $this->incident_type,
            'severity' => $this->severity,
            'occurred_at' => $this->occurred_at?->toISOString(),
            'description' => $this->description,
            'immediate_actions' => $this->immediate_actions,
            'notified_participant' => $this->notified_participant,
            'notified_ndis_commission' => $this->notified_ndis_commission,
            'ndis_reportable_type' => $this->ndis_reportable_type,
            'status' => $this->status,
            'participant' => $this->whenLoaded('participant', fn () => [
                'id' => $this->participant->id,
                'full_name' => $this->participant->full_name,
            ]),
            'reporter' => $this->whenLoaded('reporter', fn () => [
                'id' => $this->reporter->id,
                'full_name' => $this->reporter->full_name,
            ]),
            'follow_ups' => IncidentFollowUpResource::collection($this->whenLoaded('followUps')),
        ];
    }
}
