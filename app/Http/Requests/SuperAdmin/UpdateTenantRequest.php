<?php

namespace App\Http\Requests\SuperAdmin;

use App\Models\Tenant;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTenantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('super_admin');
    }

    /**
     * @return array<string, array<int, mixed>>
     */
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
            'director_email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($this->directorId())],
            'director_password' => ['nullable', 'string', 'min:8'],
        ];
    }

    private function directorId(): ?string
    {
        $tenant = $this->route('tenant');

        if (! $tenant instanceof Tenant) {
            return null;
        }

        return $tenant->users()->role('director')->first()?->id;
    }
}
