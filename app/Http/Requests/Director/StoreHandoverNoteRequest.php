<?php

namespace App\Http\Requests\Director;

use Illuminate\Foundation\Http\FormRequest;

class StoreHandoverNoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasAnyRole(['director', 'manager', 'staff_worker']);
    }

    public function rules(): array
    {
        return [
            'staff_id' => ['required', 'uuid', 'exists:users,id'],
            'content' => ['required', 'string'],
            'status' => ['required', 'in:draft,submitted,reviewed'],
        ];
    }
}
