<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class TenantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'plan' => $this->plan,
            'status' => $this->status,
            'abn' => $this->abn,
            'ndis_provider_number' => $this->ndis_provider_number,
            'contact_email' => $this->contact_email,
            'contact_phone' => $this->contact_phone,
            'trial_ends_at' => $this->trial_ends_at?->toISOString(),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
