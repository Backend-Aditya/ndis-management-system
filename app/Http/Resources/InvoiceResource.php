<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class InvoiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'participant_id' => $this->participant_id,
            'plan_id' => $this->plan_id,
            'invoice_number' => $this->invoice_number,
            'invoice_date' => $this->invoice_date?->toDateString(),
            'due_date' => $this->due_date?->toDateString(),
            'subtotal' => $this->subtotal,
            'gst_amount' => $this->gst_amount,
            'total_amount' => $this->total_amount,
            'status' => $this->status,
            'paid_at' => $this->paid_at?->toISOString(),
            'participant' => $this->whenLoaded('participant', fn () => [
                'id' => $this->participant->id,
                'full_name' => $this->participant->full_name,
                'ndis_number' => $this->participant->ndis_number,
            ]),
            'line_items' => InvoiceLineItemResource::collection($this->whenLoaded('lineItems')),
            'payments' => PaymentResource::collection($this->whenLoaded('payments')),
            'claim' => $this->whenLoaded('claim', fn () => $this->claim ? (new NdisClaimResource($this->claim))->resolve() : null),
        ];
    }
}
