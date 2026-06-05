<?php

namespace App\Http\Requests\Director;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStaffRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasAnyRole(['director', 'manager']);
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', "unique:users,email,{$this->route('staff')}"],
            'role' => ['required', 'in:manager,staff_worker'],
            'phone' => ['nullable', 'string', 'max:20'],
            'is_active' => ['boolean'],
            'position' => ['nullable', 'string', 'max:255'],
            'department' => ['nullable', 'string', 'max:255'],
            'employment_type' => ['nullable', 'in:full_time,part_time,casual'],
            'employment_start' => ['nullable', 'date'],
            'hourly_rate' => ['nullable', 'numeric', 'min:0'],
            'kms_rate' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
