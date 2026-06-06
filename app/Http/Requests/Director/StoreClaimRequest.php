<?php

namespace App\Http\Requests\Director;

use Illuminate\Foundation\Http\FormRequest;

class StoreClaimRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasAnyRole(['director', 'manager']);
    }

    public function rules(): array
    {
        return [
            'claim_type' => ['required', 'in:standard,cancellation,travel'],
            'claim_period_start' => ['required', 'date'],
            'claim_period_end' => ['required', 'date', 'after_or_equal:claim_period_start'],
            'claim_amount' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
