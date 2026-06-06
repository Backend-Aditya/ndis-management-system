<?php

namespace App\Http\Controllers\Director;

use App\Http\Controllers\Controller;
use App\Http\Resources\NdisClaimResource;
use App\Models\NdisClaim;
use App\Services\ClaimService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NdisClaimController extends Controller
{
    public function __construct(private readonly ClaimService $claimService) {}

    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $claims = NdisClaim::with('invoice')
            ->when($search, function ($q) use ($search) {
                $q->where('claim_reference', 'like', "%{$search}%")
                    ->orWhere('claim_type', 'like', "%{$search}%")
                    ->orWhere('submission_status', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('billing/claims/index', [
            'claims' => NdisClaimResource::collection($claims),
        ]);
    }

    public function submit(NdisClaim $claim): RedirectResponse
    {
        $this->claimService->markSubmitted($claim, 'OK');

        return back()->with('success', 'Claim submitted.');
    }

    public function destroy(NdisClaim $claim): RedirectResponse
    {
        $claim->delete();

        return back()->with('success', 'Claim removed.');
    }
}
