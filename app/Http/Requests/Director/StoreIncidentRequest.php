<?php

namespace App\Http\Requests\Director;

use Illuminate\Foundation\Http\FormRequest;

class StoreIncidentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasAnyRole(['director', 'manager', 'staff_worker']);
    }

    public function rules(): array
    {
        return [
            'participant_id' => ['required', 'uuid', 'exists:participants,id'],
            'shift_id' => ['nullable', 'uuid', 'exists:shifts,id'],
            'incident_type' => ['required', 'in:injury,medication_error,behaviour,property_damage,abuse_neglect,other'],
            'severity' => ['required', 'in:low,medium,high,critical'],
            'occurred_at' => ['required', 'date'],
            'description' => ['required', 'string'],
            'immediate_actions' => ['nullable', 'string'],
            'notified_participant' => ['boolean'],
            'notified_ndis_commission' => ['boolean'],
            'ndis_reportable_type' => ['nullable', 'string', 'max:100'],
            'status' => ['required', 'in:open,investigating,closed'],
        ];
    }
}
