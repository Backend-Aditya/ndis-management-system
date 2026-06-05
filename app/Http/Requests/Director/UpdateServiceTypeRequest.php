<?php

namespace App\Http\Requests\Director;

use Illuminate\Foundation\Http\FormRequest;

class UpdateServiceTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasAnyRole(['director', 'manager']);
    }

    public function rules(): array
    {
        return [
            'ndis_support_item_number' => ['nullable', 'string', 'max:50'],
            'name' => ['required', 'string', 'max:255'],
            'support_category' => ['nullable', 'string', 'max:100'],
            'unit_of_measure' => ['nullable', 'string', 'max:20'],
            'standard_rate' => ['required', 'numeric', 'min:0'],
            'weeknight_rate' => ['nullable', 'numeric', 'min:0'],
            'saturday_rate' => ['nullable', 'numeric', 'min:0'],
            'sunday_rate' => ['nullable', 'numeric', 'min:0'],
            'public_holiday_rate' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
        ];
    }
}
