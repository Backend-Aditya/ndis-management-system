<?php

namespace App\Http\Requests\Director;

use Illuminate\Foundation\Http\FormRequest;

class StoreAuditRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('director');
    }

    public function rules(): array
    {
        return [
            'audit_type' => ['required', 'in:certification,verification,mid_term,practice_standard'],
            'auditor_name' => ['required', 'string', 'max:255'],
            'audit_date' => ['required', 'date'],
            'next_audit_date' => ['nullable', 'date'],
            'outcome' => ['nullable', 'in:pass,conditional,minor_nc,major_nc'],
            'status' => ['required', 'in:scheduled,in_progress,completed'],
        ];
    }
}
