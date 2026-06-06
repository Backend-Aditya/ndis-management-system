<?php

namespace App\Http\Controllers\Director;

use App\Http\Controllers\Controller;
use App\Http\Requests\Director\StoreRiskAssessmentRequest;
use App\Http\Resources\ParticipantResource;
use App\Http\Resources\RiskAssessmentResource;
use App\Models\Participant;
use App\Models\RiskAssessment;
use App\Services\ComplianceService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class RiskAssessmentController extends Controller
{
    public function __construct(private readonly ComplianceService $complianceService) {}

    public function index(): Response
    {
        $assessments = RiskAssessment::with('participant')->latest()->paginate(25);

        return Inertia::render('compliance/risk-assessments/index', [
            'assessments' => RiskAssessmentResource::collection($assessments),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('compliance/risk-assessments/create', [
            'participants' => ParticipantResource::collection(Participant::orderBy('last_name')->get()),
        ]);
    }

    public function store(StoreRiskAssessmentRequest $request): RedirectResponse
    {
        $this->complianceService->createRiskAssessment($request->validated());

        return redirect()->route('risk-assessments.index')->with('success', 'Risk assessment created.');
    }

    public function destroy(RiskAssessment $riskAssessment): RedirectResponse
    {
        $riskAssessment->delete();

        return back()->with('success', 'Risk assessment removed.');
    }
}
