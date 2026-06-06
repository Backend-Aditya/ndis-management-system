<?php

namespace App\Http\Requests\Director;

use Illuminate\Foundation\Http\FormRequest;

class CancelShiftRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasAnyRole(['director', 'manager']);
    }

    public function rules(): array
    {
        return [
            'cancelled_by_type' => ['required', 'in:participant,provider'],
            'reason_code' => ['nullable', 'string', 'max:100'],
            'reason_notes' => ['nullable', 'string'],
            'billable' => ['boolean'],
        ];
    }
}
