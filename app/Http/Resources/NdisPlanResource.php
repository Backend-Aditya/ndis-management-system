<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class NdisPlanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'participant_id' => $this->participant_id,
            'plan_number' => $this->plan_number,
            'plan_start_date' => $this->plan_start_date?->toDateString(),
            'plan_end_date' => $this->plan_end_date?->toDateString(),
            'plan_type' => $this->plan_type,
            'management_type' => $this->management_type,
            'core_total' => $this->core_total,
            'capacity_total' => $this->capacity_total,
            'capital_total' => $this->capital_total,
            'total_funding' => $this->total_funding,
            'status' => $this->status,
            'ndia_contact_name' => $this->ndia_contact_name,
            'ndia_contact_phone' => $this->ndia_contact_phone,
            'participant' => $this->whenLoaded('participant', fn () => [
                'id' => $this->participant->id,
                'full_name' => $this->participant->full_name,
                'ndis_number' => $this->participant->ndis_number,
            ]),
            'support_categories' => PlanSupportCategoryResource::collection($this->whenLoaded('supportCategories')),
            'managers' => $this->whenLoaded('managers', fn () => $this->managers->map(fn ($m) => [
                'id' => $m->id,
                'manager_type' => $m->manager_type,
                'company_name' => $m->company_name,
                'contact_name' => $m->contact_name,
                'email' => $m->email,
                'abn' => $m->abn,
            ])),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
