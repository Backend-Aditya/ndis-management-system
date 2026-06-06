<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class ShiftHandoverNoteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'shift_id' => $this->shift_id,
            'staff_id' => $this->staff_id,
            'content' => $this->content,
            'status' => $this->status,
            'submitted_at' => $this->submitted_at?->toISOString(),
            'reviewed_by' => $this->reviewed_by,
        ];
    }
}
