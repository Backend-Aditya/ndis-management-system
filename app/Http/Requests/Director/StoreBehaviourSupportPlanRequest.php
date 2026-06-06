<?php

namespace App\Http\Requests\Director;

use Illuminate\Foundation\Http\FormRequest;

class StoreBehaviourSupportPlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasAnyRole(['director', 'manager']);
    }

    public function rules(): array
    {
        return [
            'participant_id' => ['required', 'uuid', 'exists:participants,id'],
            'plan_date' => ['required', 'date'],
            'review_date' => ['nullable', 'date'],
            'triggers' => ['nullable', 'string'],
            'strategies' => ['nullable', 'string'],
            'uses_restrictive_practices' => ['boolean'],
            'restrictive_practice_type' => ['nullable', 'string', 'max:100'],
            'status' => ['required', 'in:active,under_review,expired'],
        ];
    }
}
