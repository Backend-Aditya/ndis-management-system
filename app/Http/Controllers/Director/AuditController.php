<?php

namespace App\Http\Controllers\Director;

use App\Http\Controllers\Controller;
use App\Http\Requests\Director\StoreAuditRequest;
use App\Http\Resources\AuditResource;
use App\Models\Audit;
use App\Services\ComplianceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditController extends Controller
{
    public function __construct(private readonly ComplianceService $complianceService) {}

    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $audits = Audit::query()
            ->when($search, function ($q) use ($search) {
                $q->where('audit_type', 'like', "%{$search}%")
                    ->orWhere('auditor_name', 'like', "%{$search}%")
                    ->orWhere('outcome', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('compliance/audits/index', [
            'audits' => AuditResource::collection($audits),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('compliance/audits/create');
    }

    public function store(StoreAuditRequest $request): RedirectResponse
    {
        $this->complianceService->createAudit($request->validated());

        return redirect()->route('audits.index')->with('success', 'Audit recorded.');
    }

    public function destroy(Audit $audit): RedirectResponse
    {
        $audit->delete();

        return back()->with('success', 'Audit removed.');
    }
}
