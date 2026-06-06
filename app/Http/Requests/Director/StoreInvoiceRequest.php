<?php

namespace App\Http\Requests\Director;

use Illuminate\Foundation\Http\FormRequest;

class StoreInvoiceRequest extends FormRequest
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
            'invoice_date' => ['required', 'date'],
            'due_date' => ['nullable', 'date', 'after_or_equal:invoice_date'],
            'line_items' => ['required', 'array', 'min:1'],
            'line_items.*.service_type_id' => ['required', 'uuid', 'exists:service_types,id'],
            'line_items.*.description' => ['required', 'string', 'max:255'],
            'line_items.*.support_item_number' => ['nullable', 'string', 'max:50'],
            'line_items.*.service_date' => ['required', 'date'],
            'line_items.*.quantity' => ['required', 'numeric', 'min:0'],
            'line_items.*.unit_price' => ['required', 'numeric', 'min:0'],
        ];
    }
}
