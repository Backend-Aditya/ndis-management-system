<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class ParticipantGoalResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'participant_id' => $this->participant_id,
            'goal_text' => $this->goal_text,
            'category' => $this->category,
            'status' => $this->status,
            'target_date' => $this->target_date?->toDateString(),
            'progress_notes' => $this->progress_notes,
        ];
    }
}
