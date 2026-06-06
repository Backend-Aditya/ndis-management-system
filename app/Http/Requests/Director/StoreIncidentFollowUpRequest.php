<?php

namespace App\Http\Requests\Director;

use Illuminate\Foundation\Http\FormRequest;

class StoreIncidentFollowUpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasAnyRole(['director', 'manager', 'staff_worker']);
    }

    public function rules(): array
    {
        return [
            'staff_id' => ['required', 'uuid', 'exists:users,id'],
            'action_taken' => ['required', 'string'],
            'is_resolved' => ['boolean'],
        ];
    }
}
