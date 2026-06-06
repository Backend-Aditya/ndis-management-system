<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class AuditResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'audit_type' => $this->audit_type,
            'auditor_name' => $this->auditor_name,
            'audit_date' => $this->audit_date?->toDateString(),
            'next_audit_date' => $this->next_audit_date?->toDateString(),
            'outcome' => $this->outcome,
            'status' => $this->status,
        ];
    }
}
