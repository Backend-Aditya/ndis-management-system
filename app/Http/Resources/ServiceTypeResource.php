<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class ServiceTypeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ndis_support_item_number' => $this->ndis_support_item_number,
            'name' => $this->name,
            'support_category' => $this->support_category,
            'unit_of_measure' => $this->unit_of_measure,
            'standard_rate' => $this->standard_rate,
            'weeknight_rate' => $this->weeknight_rate,
            'saturday_rate' => $this->saturday_rate,
            'sunday_rate' => $this->sunday_rate,
            'public_holiday_rate' => $this->public_holiday_rate,
            'is_active' => $this->is_active,
        ];
    }
}
