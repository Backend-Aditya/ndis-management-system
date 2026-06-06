<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SuperAdmin\StoreTenantRequest;
use App\Http\Requests\SuperAdmin\UpdateTenantRequest;
use App\Http\Resources\TenantResource;
use App\Models\Tenant;
use App\Services\TenantService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TenantController extends Controller
{
    public function __construct(private readonly TenantService $tenantService) {}

    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $tenants = Tenant::withoutGlobalScopes()
            ->when($search, function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('contact_email', 'like', "%{$search}%")
                    ->orWhere('abn', 'like', "%{$search}%")
                    ->orWhere('ndis_provider_number', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('super-admin/tenants/index', [
            'tenants' => TenantResource::collection($tenants),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('super-admin/tenants/create');
    }

    public function store(StoreTenantRequest $request): RedirectResponse
    {
        $this->tenantService->createOrganisation($request->validated());

        return redirect()->route('super-admin.tenants.index')
            ->with('success', 'Organisation and director account created.');
    }

    public function edit(Tenant $tenant): Response
    {
        return Inertia::render('super-admin/tenants/edit', [
            'tenant' => TenantResource::make($tenant)->resolve(),
        ]);
    }

    public function update(UpdateTenantRequest $request, Tenant $tenant): RedirectResponse
    {
        $this->tenantService->update($tenant, $request->validated());

        return redirect()->route('super-admin.tenants.index')->with('success', 'Tenant updated.');
    }

    public function destroy(Tenant $tenant): RedirectResponse
    {
        $tenant->delete();

        return redirect()->route('super-admin.tenants.index')->with('success', 'Tenant deleted.');
    }

    public function suspend(Tenant $tenant): RedirectResponse
    {
        $this->tenantService->suspend($tenant);

        return back()->with('success', 'Tenant suspended.');
    }

    public function activate(Tenant $tenant): RedirectResponse
    {
        $this->tenantService->activate($tenant);

        return back()->with('success', 'Tenant activated.');
    }
}
