<?php

namespace App\Http\Controllers\Director;

use App\Http\Controllers\Controller;
use App\Http\Requests\Director\StoreServiceTypeRequest;
use App\Http\Requests\Director\UpdateServiceTypeRequest;
use App\Http\Resources\ServiceTypeResource;
use App\Models\ServiceType;
use App\Services\ServiceTypeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceTypeController extends Controller
{
    public function __construct(private readonly ServiceTypeService $serviceTypeService) {}

    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $serviceTypes = ServiceType::query()
            ->when($search, function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('ndis_support_item_number', 'like', "%{$search}%")
                    ->orWhere('support_category', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('services/service-types/index', [
            'serviceTypes' => ServiceTypeResource::collection($serviceTypes),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('services/service-types/create');
    }

    public function store(StoreServiceTypeRequest $request): RedirectResponse
    {
        $this->serviceTypeService->create($request->validated());

        return redirect()->route('service-types.index')
            ->with('success', 'Service type created.');
    }

    public function edit(ServiceType $serviceType): Response
    {
        return Inertia::render('services/service-types/edit', [
            'serviceType' => ServiceTypeResource::make($serviceType)->resolve(),
        ]);
    }

    public function update(UpdateServiceTypeRequest $request, ServiceType $serviceType): RedirectResponse
    {
        $this->serviceTypeService->update($serviceType, $request->validated());

        return redirect()->route('service-types.index')
            ->with('success', 'Service type updated.');
    }

    public function destroy(ServiceType $serviceType): RedirectResponse
    {
        $serviceType->delete();

        return redirect()->route('service-types.index')
            ->with('success', 'Service type removed.');
    }
}
