<?php

namespace App\Http\Requests\SuperAdmin;

use Illuminate\Foundation\Http\FormRequest;

class StoreTenantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('super_admin');
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'contact_email' => ['required', 'email', 'max:255'],
            'plan' => ['required', 'in:starter,professional,enterprise'],
            'status' => ['required', 'in:active,trialing,suspended'],
            'abn' => ['nullable', 'string', 'max:20'],
            'ndis_provider_number' => ['nullable', 'string', 'max:20'],
            'contact_phone' => ['nullable', 'string', 'max:20'],
            'director_first_name' => ['required', 'string', 'max:255'],
            'director_last_name' => ['required', 'string', 'max:255'],
            'director_email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'director_password' => ['required', 'string', 'min:8'],
        ];
    }
}
