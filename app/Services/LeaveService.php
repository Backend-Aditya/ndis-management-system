<?php

namespace App\Services;

use App\Models\LeaveRequest;

class LeaveService
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): LeaveRequest
    {
        return LeaveRequest::create([
            ...$data,
            'tenant_id' => app('tenant')->id,
            'status' => 'pending',
        ]);
    }

    public function approve(LeaveRequest $leaveRequest, string $approverId): LeaveRequest
    {
        $leaveRequest->update([
            'status' => 'approved',
            'approved_by' => $approverId,
        ]);

        return $leaveRequest->fresh();
    }

    public function reject(LeaveRequest $leaveRequest, string $approverId): LeaveRequest
    {
        $leaveRequest->update([
            'status' => 'rejected',
            'approved_by' => $approverId,
        ]);

        return $leaveRequest->fresh();
    }
}
