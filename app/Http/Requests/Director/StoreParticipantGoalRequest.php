<?php

namespace App\Http\Requests\Director;

use Illuminate\Foundation\Http\FormRequest;

class StoreParticipantGoalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasAnyRole(['director', 'manager', 'staff_worker']);
    }

    public function rules(): array
    {
        return [
            'goal_text' => ['required', 'string'],
            'category' => ['nullable', 'string', 'max:100'],
            'status' => ['required', 'in:active,completed,on_hold'],
            'target_date' => ['nullable', 'date'],
            'progress_notes' => ['nullable', 'string'],
        ];
    }
}
