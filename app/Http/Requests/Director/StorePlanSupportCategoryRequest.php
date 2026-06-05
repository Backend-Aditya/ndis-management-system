<?php

namespace App\Http\Requests\Director;

use Illuminate\Foundation\Http\FormRequest;

class StorePlanSupportCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasAnyRole(['director', 'manager']);
    }

    public function rules(): array
    {
        return [
            'support_purpose' => ['required', 'in:Core,Capacity Building,Capital'],
            'category_name' => ['required', 'string', 'max:255'],
            'allocated_amount' => ['required', 'numeric', 'min:0'],
            'spent_amount' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
