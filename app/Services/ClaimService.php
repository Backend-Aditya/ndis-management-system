<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\NdisClaim;

class ClaimService
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function create(Invoice $invoice, array $data): NdisClaim
    {
        return $invoice->claim()->create([
            ...$data,
            'tenant_id' => app('tenant')->id,
            'claim_amount' => $data['claim_amount'] ?? $invoice->total_amount,
            'submission_status' => 'pending',
        ]);
    }

    public function markSubmitted(NdisClaim $claim, ?string $responseCode = null): NdisClaim
    {
        $claim->update([
            'submission_status' => 'submitted',
            'portal_response_code' => $responseCode,
            'submitted_at' => now(),
        ]);

        return $claim->fresh();
    }
}
