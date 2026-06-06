<?php

namespace App\Http\Controllers\Director;

use App\Http\Controllers\Controller;
use App\Http\Resources\AuditLogResource;
use App\Models\AuditLog;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function index(): Response
    {
        $logs = AuditLog::with('user')->latest()->paginate(50);

        return Inertia::render('communications/audit-logs/index', [
            'logs' => AuditLogResource::collection($logs),
        ]);
    }
}
