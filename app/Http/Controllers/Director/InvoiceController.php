<?php

namespace App\Http\Controllers\Director;

use App\Http\Controllers\Controller;
use App\Http\Requests\Director\StoreClaimRequest;
use App\Http\Requests\Director\StoreInvoiceRequest;
use App\Http\Requests\Director\StorePaymentRequest;
use App\Http\Resources\InvoiceResource;
use App\Http\Resources\NdisPlanResource;
use App\Http\Resources\ParticipantResource;
use App\Http\Resources\ServiceTypeResource;
use App\Models\Invoice;
use App\Models\NdisPlan;
use App\Models\Participant;
use App\Models\ServiceType;
use App\Services\ClaimService;
use App\Services\InvoiceService;
use App\Services\PaymentService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
    public function __construct(
        private readonly InvoiceService $invoiceService,
        private readonly PaymentService $paymentService,
        private readonly ClaimService $claimService,
    ) {}

    public function index(): Response
    {
        $invoices = Invoice::with('participant')->latest()->paginate(25);

        return Inertia::render('billing/invoices/index', [
            'invoices' => InvoiceResource::collection($invoices),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('billing/invoices/create', [
            'participants' => ParticipantResource::collection(Participant::orderBy('last_name')->get()),
            'plans' => NdisPlanResource::collection(NdisPlan::with('participant')->get()),
            'serviceTypes' => ServiceTypeResource::collection(ServiceType::where('is_active', true)->get()),
        ]);
    }

    public function store(StoreInvoiceRequest $request): RedirectResponse
    {
        $invoice = $this->invoiceService->create($request->validated());

        return redirect()->route('invoices.show', $invoice)->with('success', 'Invoice created.');
    }

    public function show(Invoice $invoice): Response
    {
        $invoice->load(['participant', 'lineItems', 'payments', 'claim']);

        return Inertia::render('billing/invoices/show', [
            'invoice' => InvoiceResource::make($invoice)->resolve(),
        ]);
    }

    public function destroy(Invoice $invoice): RedirectResponse
    {
        $invoice->delete();

        return redirect()->route('invoices.index')->with('success', 'Invoice removed.');
    }

    public function markSent(Invoice $invoice): RedirectResponse
    {
        $this->invoiceService->markAsSent($invoice);

        return back()->with('success', 'Invoice marked as sent.');
    }

    public function addPayment(StorePaymentRequest $request, Invoice $invoice): RedirectResponse
    {
        $this->paymentService->record($invoice, $request->validated());

        return back()->with('success', 'Payment recorded.');
    }

    public function createClaim(StoreClaimRequest $request, Invoice $invoice): RedirectResponse
    {
        $this->claimService->create($invoice, $request->validated());

        return back()->with('success', 'Claim created.');
    }
}
