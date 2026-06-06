<?php

namespace App\Http\Controllers\Director;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(): Response
    {
        $payments = Payment::with('invoice')
            ->whereHas('invoice', fn ($q) => $q->where('tenant_id', app('tenant')->id))
            ->latest()
            ->paginate(25);

        return Inertia::render('billing/payments/index', [
            'payments' => PaymentResource::collection($payments),
        ]);
    }
}
