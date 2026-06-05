<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class PlanSupportCategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'plan_id' => $this->plan_id,
            'support_purpose' => $this->support_purpose,
            'category_name' => $this->category_name,
            'allocated_amount' => $this->allocated_amount,
            'spent_amount' => $this->spent_amount,
            'items' => $this->whenLoaded('items', fn () => $this->items->map(fn ($i) => [
                'id' => $i->id,
                'support_item_number' => $i->support_item_number,
                'support_item_name' => $i->support_item_name,
                'unit_of_measure' => $i->unit_of_measure,
                'unit_price' => $i->unit_price,
                'quantity_allocated' => $i->quantity_allocated,
                'quantity_used' => $i->quantity_used,
            ])),
        ];
    }
}
