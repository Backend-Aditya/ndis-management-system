<?php

namespace App\Http\Requests\Director;

use Illuminate\Foundation\Http\FormRequest;

class StoreParticipantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasAnyRole(['director', 'manager', 'staff_worker']);
    }

    public function rules(): array
    {
        return [
            'ndis_number' => ['required', 'string', 'max:20', 'unique:participants,ndis_number'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'date_of_birth' => ['required', 'date', 'before:today'],
            'gender' => ['nullable', 'in:male,female,non_binary,prefer_not_to_say'],
            'pronouns' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:500'],
            'suburb' => ['nullable', 'string', 'max:100'],
            'state' => ['nullable', 'in:NSW,VIC,QLD,SA,WA,TAS,ACT,NT'],
            'postcode' => ['nullable', 'string', 'max:10'],
            'primary_language' => ['nullable', 'string', 'max:100'],
            'interpreter_required' => ['boolean'],
            'communication_needs' => ['nullable', 'string', 'max:1000'],
            'cultural_background' => ['nullable', 'string', 'max:255'],
            'participant_status' => ['required', 'in:active,inactive,pending'],
        ];
    }
}
