<?php

namespace App\Http\Controllers\Director;

use App\Http\Controllers\Controller;
use App\Http\Requests\Director\CancelShiftRequest;
use App\Http\Requests\Director\StoreHandoverNoteRequest;
use App\Http\Requests\Director\StoreShiftRequest;
use App\Http\Requests\Director\UpdateShiftRequest;
use App\Http\Resources\ParticipantResource;
use App\Http\Resources\ServiceTypeResource;
use App\Http\Resources\ShiftResource;
use App\Http\Resources\UserResource;
use App\Models\Participant;
use App\Models\ServiceType;
use App\Models\Shift;
use App\Models\User;
use App\Services\ShiftService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShiftController extends Controller
{
    public function __construct(private readonly ShiftService $shiftService) {}

    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $shifts = Shift::with(['participant', 'staff', 'serviceType'])
            ->when($search, function ($q) use ($search) {
                $q->where('status', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhereHas('participant', fn ($pq) => $pq->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%"));
            })
            ->orderBy('scheduled_start', 'desc')
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('scheduling/shifts/index', [
            'shifts' => ShiftResource::collection($shifts),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('scheduling/shifts/create', [
            'participants' => ParticipantResource::collection(Participant::orderBy('last_name')->get()),
            'staff' => UserResource::collection(User::whereHas('roles', fn ($q) => $q->whereIn('name', ['manager', 'staff_worker']))->get()),
            'serviceTypes' => ServiceTypeResource::collection(ServiceType::where('is_active', true)->get()),
        ]);
    }

    public function store(StoreShiftRequest $request): RedirectResponse
    {
        $shift = $this->shiftService->create($request->validated());

        return redirect()->route('shifts.show', $shift)->with('success', 'Shift scheduled.');
    }

    public function show(Shift $shift): Response
    {
        $shift->load(['participant', 'staff', 'serviceType', 'cancellation', 'handoverNotes']);

        return Inertia::render('scheduling/shifts/show', [
            'shift' => ShiftResource::make($shift)->resolve(),
        ]);
    }

    public function edit(Shift $shift): Response
    {
        $shift->load(['participant', 'staff', 'serviceType']);

        return Inertia::render('scheduling/shifts/edit', [
            'shift' => ShiftResource::make($shift)->resolve(),
            'participants' => ParticipantResource::collection(Participant::orderBy('last_name')->get()),
            'staff' => UserResource::collection(User::whereHas('roles', fn ($q) => $q->whereIn('name', ['manager', 'staff_worker']))->get()),
            'serviceTypes' => ServiceTypeResource::collection(ServiceType::where('is_active', true)->get()),
        ]);
    }

    public function update(UpdateShiftRequest $request, Shift $shift): RedirectResponse
    {
        $this->shiftService->update($shift, $request->validated());

        return redirect()->route('shifts.show', $shift)->with('success', 'Shift updated.');
    }

    public function destroy(Shift $shift): RedirectResponse
    {
        $shift->delete();

        return redirect()->route('shifts.index')->with('success', 'Shift removed.');
    }

    public function cancel(CancelShiftRequest $request, Shift $shift): RedirectResponse
    {
        $data = $request->validated();
        $data['cancelled_by_user'] = $request->user()->id;
        $this->shiftService->cancel($shift, $data);

        return back()->with('success', 'Shift cancelled.');
    }

    public function addHandover(StoreHandoverNoteRequest $request, Shift $shift): RedirectResponse
    {
        $this->shiftService->addHandoverNote($shift, $request->validated());

        return back()->with('success', 'Handover note added.');
    }
}
