<?php

namespace App\Http\Controllers\Director;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        // Invoice's HasTenant global scope filters to the current tenant.
        $payments = Payment::with('invoice')
            ->whereHas('invoice')
            ->when($search, function ($q) use ($search) {
                $q->where('payment_method', 'like', "%{$search}%")
                    ->orWhere('reference_number', 'like', "%{$search}%")
                    ->orWhere('payer_name', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('billing/payments/index', [
            'payments' => PaymentResource::collection($payments),
        ]);
    }
}
