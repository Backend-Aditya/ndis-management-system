<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class NdisClaimResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'invoice_id' => $this->invoice_id,
            'claim_reference' => $this->claim_reference,
            'claim_type' => $this->claim_type,
            'claim_period_start' => $this->claim_period_start?->toDateString(),
            'claim_period_end' => $this->claim_period_end?->toDateString(),
            'claim_amount' => $this->claim_amount,
            'submission_status' => $this->submission_status,
            'portal_response_code' => $this->portal_response_code,
            'submitted_at' => $this->submitted_at?->toISOString(),
            'invoice' => $this->whenLoaded('invoice', fn () => [
                'id' => $this->invoice->id,
                'invoice_number' => $this->invoice->invoice_number,
            ]),
        ];
    }
}
