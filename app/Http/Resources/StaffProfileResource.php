<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class StaffProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'employee_number' => $this->employee_number,
            'position' => $this->position,
            'department' => $this->department,
            'employment_type' => $this->employment_type,
            'employment_start' => $this->employment_start?->toDateString(),
            'employment_end' => $this->employment_end?->toDateString(),
            'hourly_rate' => $this->hourly_rate,
            'kms_rate' => $this->kms_rate,
        ];
    }
}
