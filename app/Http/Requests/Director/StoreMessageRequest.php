<?php

namespace App\Http\Requests\Director;

use Illuminate\Foundation\Http\FormRequest;

class StoreMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasAnyRole(['director', 'manager', 'staff_worker']);
    }

    public function rules(): array
    {
        return [
            'subject' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'message_type' => ['required', 'in:general,urgent,reminder'],
            'is_broadcast' => ['boolean'],
            'recipient_ids' => ['nullable', 'array'],
            'recipient_ids.*' => ['uuid', 'exists:users,id'],
        ];
    }
}
