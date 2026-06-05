<?php

namespace App\Http\Requests\Director;

use Illuminate\Foundation\Http\FormRequest;

class StoreNdisPlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasAnyRole(['director', 'manager']);
    }

    public function rules(): array
    {
        return [
            'participant_id' => ['required', 'uuid', 'exists:participants,id'],
            'plan_number' => ['nullable', 'string', 'max:50'],
            'plan_start_date' => ['required', 'date'],
            'plan_end_date' => ['required', 'date', 'after:plan_start_date'],
            'plan_type' => ['nullable', 'string', 'max:50'],
            'management_type' => ['required', 'in:agency_managed,plan_managed,self_managed'],
            'core_total' => ['nullable', 'numeric', 'min:0'],
            'capacity_total' => ['nullable', 'numeric', 'min:0'],
            'capital_total' => ['nullable', 'numeric', 'min:0'],
            'total_funding' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', 'in:active,expired,pending'],
            'ndia_contact_name' => ['nullable', 'string', 'max:255'],
            'ndia_contact_phone' => ['nullable', 'string', 'max:20'],
        ];
    }
}
