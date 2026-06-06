<?php

namespace App\Services;

use App\Models\Invoice;
use Illuminate\Support\Facades\DB;

class InvoiceService
{
    /**
     * @param  array{participant_id: string, plan_id: string, invoice_date: string, due_date?: string, line_items: array<int, array{service_type_id: string, description: string, support_item_number?: string, service_date: string, quantity: numeric, unit_price: numeric}>}  $data
     */
    public function create(array $data): Invoice
    {
        return DB::transaction(function () use ($data) {
            $lineItems = $data['line_items'] ?? [];

            $subtotal = collect($lineItems)->sum(fn ($item) => (float) $item['quantity'] * (float) $item['unit_price']);
            $gst = round($subtotal * 0.1, 2);

            $invoice = Invoice::create([
                'tenant_id' => app('tenant')->id,
                'participant_id' => $data['participant_id'],
                'plan_id' => $data['plan_id'],
                'invoice_number' => $this->generateInvoiceNumber(),
                'invoice_date' => $data['invoice_date'],
                'due_date' => $data['due_date'] ?? null,
                'subtotal' => $subtotal,
                'gst_amount' => $gst,
                'total_amount' => $subtotal + $gst,
                'status' => 'draft',
            ]);

            foreach ($lineItems as $item) {
                $lineTotal = round((float) $item['quantity'] * (float) $item['unit_price'], 2);
                $invoice->lineItems()->create([
                    'service_type_id' => $item['service_type_id'],
                    'shift_id' => $item['shift_id'] ?? null,
                    'description' => $item['description'],
                    'support_item_number' => $item['support_item_number'] ?? null,
                    'service_date' => $item['service_date'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'line_total' => $lineTotal,
                ]);
            }

            return $invoice->load('lineItems');
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Invoice $invoice, array $data): Invoice
    {
        $invoice->update($data);

        return $invoice->fresh();
    }

    public function markAsSent(Invoice $invoice): Invoice
    {
        $invoice->update(['status' => 'sent']);

        return $invoice;
    }

    private function generateInvoiceNumber(): string
    {
        $count = Invoice::withoutGlobalScopes()->where('tenant_id', app('tenant')->id)->count();

        return 'INV-'.str_pad((string) ($count + 1), 6, '0', STR_PAD_LEFT);
    }
}
