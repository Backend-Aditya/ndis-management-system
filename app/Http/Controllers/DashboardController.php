<?php

namespace App\Http\Controllers;

use App\Models\Incident;
use App\Models\Invoice;
use App\Models\Participant;
use App\Models\Shift;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        if ($user->hasRole('super_admin')) {
            return Inertia::render('dashboard', [
                'role' => 'super_admin',
                'stats' => $this->superAdminStats(),
            ]);
        }

        return Inertia::render('dashboard', [
            'role' => 'tenant',
            'stats' => $this->tenantStats(),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function superAdminStats(): array
    {
        $tenants = Tenant::withoutGlobalScopes();

        return [
            'total_organisations' => (clone $tenants)->count(),
            'active_organisations' => (clone $tenants)->where('status', 'active')->count(),
            'trialing_organisations' => (clone $tenants)->where('status', 'trialing')->count(),
            'suspended_organisations' => (clone $tenants)->where('status', 'suspended')->count(),
            'total_users' => User::withoutGlobalScopes()->whereNotNull('tenant_id')->count(),
            'platform_admins' => User::withoutGlobalScopes()->whereNull('tenant_id')->count(),
            'recent_organisations' => Tenant::withoutGlobalScopes()
                ->latest()
                ->take(5)
                ->get(['id', 'name', 'status', 'plan', 'created_at'])
                ->map(fn ($t) => [
                    'id' => $t->id,
                    'name' => $t->name,
                    'status' => $t->status,
                    'plan' => $t->plan,
                    'created_at' => $t->created_at->toISOString(),
                ]),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function tenantStats(): array
    {
        // HasTenant global scope auto-filters all these to the current tenant.
        return [
            'total_participants' => Participant::count(),
            'active_participants' => Participant::where('participant_status', 'active')->count(),
            'upcoming_shifts' => Shift::where('scheduled_start', '>=', now())
                ->where('status', 'scheduled')
                ->count(),
            'shifts_this_week' => Shift::whereBetween('scheduled_start', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            'unpaid_invoices' => Invoice::whereIn('status', ['draft', 'sent', 'overdue'])->count(),
            'open_incidents' => Incident::where('status', 'open')->count(),
            'staff_count' => User::whereHas('roles', fn ($q) => $q->whereIn('name', ['manager', 'staff_worker']))->count(),
            'recent_incidents' => Incident::with('participant')
                ->where('status', 'open')
                ->latest()
                ->take(5)
                ->get()
                ->map(fn ($i) => [
                    'id' => $i->id,
                    'incident_type' => $i->incident_type,
                    'severity' => $i->severity,
                    'participant_name' => $i->participant?->full_name,
                    'occurred_at' => $i->occurred_at?->toISOString(),
                ]),
        ];
    }
}
