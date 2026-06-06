<?php

namespace App\Http\Requests\Director;

use Illuminate\Foundation\Http\FormRequest;

class StoreLeaveRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasAnyRole(['director', 'manager', 'staff_worker']);
    }

    public function rules(): array
    {
        return [
            'staff_id' => ['required', 'uuid', 'exists:users,id'],
            'leave_type' => ['required', 'in:annual,sick,personal,unpaid'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'hours' => ['nullable', 'numeric', 'min:0'],
            'reason' => ['nullable', 'string'],
        ];
    }
}
