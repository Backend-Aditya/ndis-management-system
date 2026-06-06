<?php

namespace App\Http\Controllers\Director;

use App\Http\Controllers\Controller;
use App\Http\Resources\AuditLogResource;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $logs = AuditLog::with('user')
            ->when($search, function ($q) use ($search) {
                $q->where('action', 'like', "%{$search}%")
                    ->orWhere('resource_type', 'like', "%{$search}%")
                    ->orWhere('ip_address', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('communications/audit-logs/index', [
            'logs' => AuditLogResource::collection($logs),
        ]);
    }
}
