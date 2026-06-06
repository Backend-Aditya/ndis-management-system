<?php

namespace App\Http\Requests\Director;

use Illuminate\Foundation\Http\FormRequest;

class StoreRiskAssessmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasAnyRole(['director', 'manager']);
    }

    public function rules(): array
    {
        return [
            'participant_id' => ['required', 'uuid', 'exists:participants,id'],
            'risk_area' => ['required', 'string', 'max:100'],
            'risk_description' => ['required', 'string'],
            'likelihood' => ['required', 'in:rare,unlikely,possible,likely,almost_certain'],
            'impact' => ['required', 'in:negligible,minor,moderate,major,severe'],
            'risk_level' => ['required', 'in:low,medium,high,extreme'],
            'mitigation_strategies' => ['nullable', 'string'],
            'review_date' => ['nullable', 'date'],
        ];
    }
}
