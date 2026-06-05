<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class ServiceAgreementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'participant_id' => $this->participant_id,
            'plan_id' => $this->plan_id,
            'agreement_start' => $this->agreement_start?->toDateString(),
            'agreement_end' => $this->agreement_end?->toDateString(),
            'status' => $this->status,
            'signed_by_participant' => $this->signed_by_participant,
            'signed_date' => $this->signed_date?->toDateString(),
            'participant' => $this->whenLoaded('participant', fn () => [
                'id' => $this->participant->id,
                'full_name' => $this->participant->full_name,
            ]),
            'items' => $this->whenLoaded('items', fn () => $this->items->map(fn ($i) => [
                'id' => $i->id,
                'service_type_id' => $i->service_type_id,
                'service_type_name' => $i->serviceType?->name,
                'quantity_agreed' => $i->quantity_agreed,
                'unit_price' => $i->unit_price,
                'frequency' => $i->frequency,
            ])),
        ];
    }
}
