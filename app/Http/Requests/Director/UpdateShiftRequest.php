<?php

namespace App\Http\Requests\Director;

use Illuminate\Foundation\Http\FormRequest;

class UpdateShiftRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasAnyRole(['director', 'manager', 'staff_worker']);
    }

    public function rules(): array
    {
        return [
            'participant_id' => ['required', 'uuid', 'exists:participants,id'],
            'staff_id' => ['required', 'uuid', 'exists:users,id'],
            'service_type_id' => ['required', 'uuid', 'exists:service_types,id'],
            'scheduled_start' => ['required', 'date'],
            'scheduled_end' => ['required', 'date', 'after:scheduled_start'],
            'actual_start' => ['nullable', 'date'],
            'actual_end' => ['nullable', 'date', 'after_or_equal:actual_start'],
            'status' => ['required', 'in:scheduled,in_progress,completed,cancelled'],
            'location' => ['nullable', 'string', 'max:500'],
            'requires_transport' => ['boolean'],
            'kms_travelled' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
