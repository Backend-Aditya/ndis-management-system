<?php

namespace App\Http\Controllers\Director;

use App\Http\Controllers\Controller;
use App\Http\Requests\Director\StoreServiceAgreementRequest;
use App\Http\Resources\NdisPlanResource;
use App\Http\Resources\ParticipantResource;
use App\Http\Resources\ServiceAgreementResource;
use App\Models\NdisPlan;
use App\Models\Participant;
use App\Models\ServiceAgreement;
use App\Services\ServiceTypeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceAgreementController extends Controller
{
    public function __construct(private readonly ServiceTypeService $serviceTypeService) {}

    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $agreements = ServiceAgreement::with('participant')
            ->when($search, function ($q) use ($search) {
                $q->where('status', 'like', "%{$search}%")
                    ->orWhereHas('participant', fn ($pq) => $pq->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%"));
            })
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('services/agreements/index', [
            'agreements' => ServiceAgreementResource::collection($agreements),
        ]);
    }

    public function create(): Response
    {
        $participants = Participant::orderBy('last_name')->get(['id', 'first_name', 'last_name', 'ndis_number']);
        $plans = NdisPlan::with('participant')->orderBy('created_at', 'desc')->get();

        return Inertia::render('services/agreements/create', [
            'participants' => ParticipantResource::collection($participants),
            'plans' => NdisPlanResource::collection($plans),
        ]);
    }

    public function store(StoreServiceAgreementRequest $request): RedirectResponse
    {
        $agreement = $this->serviceTypeService->createAgreement($request->validated());

        return redirect()->route('service-agreements.show', $agreement)
            ->with('success', 'Service agreement created.');
    }

    public function show(ServiceAgreement $serviceAgreement): Response
    {
        $serviceAgreement->load(['participant', 'plan', 'items.serviceType']);

        return Inertia::render('services/agreements/show', [
            'agreement' => ServiceAgreementResource::make($serviceAgreement)->resolve(),
        ]);
    }

    public function destroy(ServiceAgreement $serviceAgreement): RedirectResponse
    {
        $serviceAgreement->delete();

        return redirect()->route('service-agreements.index')
            ->with('success', 'Agreement removed.');
    }
}
