<?php

namespace App\Http\Requests\Director;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceAgreementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasAnyRole(['director', 'manager']);
    }

    public function rules(): array
    {
        return [
            'participant_id' => ['required', 'uuid', 'exists:participants,id'],
            'plan_id' => ['required', 'uuid', 'exists:ndis_plans,id'],
            'agreement_start' => ['required', 'date'],
            'agreement_end' => ['required', 'date', 'after:agreement_start'],
            'status' => ['required', 'in:active,expired,pending,draft'],
        ];
    }
}
