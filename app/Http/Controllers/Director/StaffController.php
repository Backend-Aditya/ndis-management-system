<?php

namespace App\Http\Controllers\Director;

use App\Http\Controllers\Controller;
use App\Http\Requests\Director\StoreStaffRequest;
use App\Http\Requests\Director\UpdateStaffRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\StaffService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StaffController extends Controller
{
    public function __construct(private readonly StaffService $staffService) {}

    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $staff = User::with('staffProfile')
            ->whereHas('roles', fn ($q) => $q->whereIn('name', ['manager', 'staff_worker', 'director']))
            ->when($search, function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('staff/index', ['staff' => UserResource::collection($staff)]);
    }

    public function create(): Response
    {
        return Inertia::render('staff/create');
    }

    public function store(StoreStaffRequest $request): RedirectResponse
    {
        $this->staffService->create($request->validated());

        return redirect()->route('staff.index')->with('success', 'Staff member added.');
    }

    public function show(User $staff): Response
    {
        $staff->load(['staffProfile.qualifications', 'staffProfile.availability']);

        return Inertia::render('staff/show', ['staff' => UserResource::make($staff)->resolve()]);
    }

    public function edit(User $staff): Response
    {
        $staff->load('staffProfile');

        return Inertia::render('staff/edit', ['staff' => UserResource::make($staff)->resolve()]);
    }

    public function update(UpdateStaffRequest $request, User $staff): RedirectResponse
    {
        $this->staffService->update($staff, $request->validated());

        return redirect()->route('staff.index')->with('success', 'Staff member updated.');
    }

    public function destroy(User $staff): RedirectResponse
    {
        $this->staffService->deactivate($staff);

        return redirect()->route('staff.index')->with('success', 'Staff member deactivated.');
    }
}
