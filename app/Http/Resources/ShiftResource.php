<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class ShiftResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'participant_id' => $this->participant_id,
            'staff_id' => $this->staff_id,
            'service_type_id' => $this->service_type_id,
            'scheduled_start' => $this->scheduled_start?->toISOString(),
            'scheduled_end' => $this->scheduled_end?->toISOString(),
            'actual_start' => $this->actual_start?->toISOString(),
            'actual_end' => $this->actual_end?->toISOString(),
            'status' => $this->status,
            'location' => $this->location,
            'requires_transport' => $this->requires_transport,
            'kms_travelled' => $this->kms_travelled,
            'notes' => $this->notes,
            'participant' => $this->whenLoaded('participant', fn () => [
                'id' => $this->participant->id,
                'full_name' => $this->participant->full_name,
            ]),
            'staff' => $this->whenLoaded('staff', fn () => [
                'id' => $this->staff->id,
                'full_name' => $this->staff->full_name,
            ]),
            'service_type' => $this->whenLoaded('serviceType', fn () => [
                'id' => $this->serviceType->id,
                'name' => $this->serviceType->name,
            ]),
            'cancellation' => $this->whenLoaded('cancellation', fn () => $this->cancellation ? [
                'id' => $this->cancellation->id,
                'cancelled_by_type' => $this->cancellation->cancelled_by_type,
                'reason_code' => $this->cancellation->reason_code,
                'reason_notes' => $this->cancellation->reason_notes,
                'billable' => $this->cancellation->billable,
            ] : null),
            'handover_notes' => ShiftHandoverNoteResource::collection($this->whenLoaded('handoverNotes')),
        ];
    }
}
