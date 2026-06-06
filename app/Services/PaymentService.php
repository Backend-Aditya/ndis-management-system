<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function record(Invoice $invoice, array $data): Payment
    {
        return DB::transaction(function () use ($invoice, $data) {
            $payment = $invoice->payments()->create($data);

            $totalPaid = $invoice->payments()->where('status', 'completed')->sum('amount');

            if ((float) $totalPaid >= (float) $invoice->total_amount) {
                $invoice->update(['status' => 'paid', 'paid_at' => now()]);
            }

            return $payment;
        });
    }
}
