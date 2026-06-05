<?php

namespace App\Http\Requests\Director;

use Illuminate\Foundation\Http\FormRequest;

class StoreParticipantDiagnosisRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasAnyRole(['director', 'manager', 'staff_worker']);
    }

    public function rules(): array
    {
        return [
            'diagnosis_name' => ['required', 'string', 'max:255'],
            'icd_10_code' => ['nullable', 'string', 'max:20'],
            'diagnosed_date' => ['nullable', 'date'],
            'is_primary' => ['boolean'],
        ];
    }
}
