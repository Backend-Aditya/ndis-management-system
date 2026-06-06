<?php

namespace App\Http\Controllers\Director;

use App\Http\Controllers\Controller;
use App\Http\Resources\NdisClaimResource;
use App\Models\NdisClaim;
use App\Services\ClaimService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class NdisClaimController extends Controller
{
    public function __construct(private readonly ClaimService $claimService) {}

    public function index(): Response
    {
        $claims = NdisClaim::with('invoice')->latest()->paginate(25);

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
