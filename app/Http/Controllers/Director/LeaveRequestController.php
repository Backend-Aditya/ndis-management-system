<?php

namespace App\Http\Controllers\Director;

use App\Http\Controllers\Controller;
use App\Http\Requests\Director\StoreLeaveRequestRequest;
use App\Http\Resources\LeaveRequestResource;
use App\Http\Resources\UserResource;
use App\Models\LeaveRequest;
use App\Models\User;
use App\Services\LeaveService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaveRequestController extends Controller
{
    public function __construct(private readonly LeaveService $leaveService) {}

    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $leaveRequests = LeaveRequest::with('staff')
            ->when($search, function ($q) use ($search) {
                $q->where('leave_type', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%")
                    ->orWhereHas('staff', fn ($sq) => $sq->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%"));
            })
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('scheduling/leave/index', [
            'leaveRequests' => LeaveRequestResource::collection($leaveRequests),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('scheduling/leave/create', [
            'staff' => UserResource::collection(User::whereHas('roles', fn ($q) => $q->whereIn('name', ['manager', 'staff_worker']))->get()),
        ]);
    }

    public function store(StoreLeaveRequestRequest $request): RedirectResponse
    {
        $this->leaveService->create($request->validated());

        return redirect()->route('leave.index')->with('success', 'Leave request submitted.');
    }

    public function approve(LeaveRequest $leave): RedirectResponse
    {
        $this->leaveService->approve($leave, request()->user()->id);

        return back()->with('success', 'Leave approved.');
    }

    public function reject(LeaveRequest $leave): RedirectResponse
    {
        $this->leaveService->reject($leave, request()->user()->id);

        return back()->with('success', 'Leave rejected.');
    }

    public function destroy(LeaveRequest $leave): RedirectResponse
    {
        $leave->delete();

        return back()->with('success', 'Leave request removed.');
    }
}
