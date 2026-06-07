import { Head, Link } from '@inertiajs/react';
import {
    Accessibility,
    Building2,
    CalendarDays,
    Receipt,
    ShieldAlert,
    Users,
    UserCheck,
    TrendingUp,
    PauseCircle,
    ShieldCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RecentOrganisation {
    id: string;
    name: string;
    status: string;
    plan: string;
    created_at: string;
}

interface RecentIncident {
    id: string;
    incident_type: string;
    severity: string;
    participant_name: string;
    occurred_at: string;
}

interface SuperAdminStats {
    total_organisations: number;
    active_organisations: number;
    trialing_organisations: number;
    suspended_organisations: number;
    total_users: number;
    platform_admins: number;
    recent_organisations: RecentOrganisation[];
}

interface TenantStats {
    total_participants: number;
    active_participants: number;
    upcoming_shifts: number;
    shifts_this_week: number;
    unpaid_invoices: number;
    open_incidents: number;
    staff_count: number;
    recent_incidents: RecentIncident[];
}

interface Props {
    role: 'super_admin' | 'tenant';
    stats: SuperAdminStats & TenantStats;
}

interface StatCardProps {
    title: string;
    value: number | string;
    icon?: LucideIcon;
    subtext?: string;
}

function StatCard({ title, value, icon: Icon, subtext }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {Icon && <Icon className="size-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
            </CardContent>
        </Card>
    );
}

const statusVariant = (status: string) =>
    ({ active: 'default', trialing: 'secondary', suspended: 'destructive' } as const)[
        status as 'active' | 'trialing' | 'suspended'
    ] ?? 'outline';

const severityVariant = (severity: string) =>
    ({ low: 'secondary', medium: 'outline', high: 'default', critical: 'destructive' } as const)[
        severity as 'low' | 'medium' | 'high' | 'critical'
    ] ?? 'outline';

function SuperAdminDashboard({ stats }: { stats: SuperAdminStats }) {
    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Organisations" value={stats.total_organisations} icon={Building2} />
                <StatCard title="Active" value={stats.active_organisations} icon={UserCheck} subtext="Currently active" />
                <StatCard title="Trialing" value={stats.trialing_organisations} icon={TrendingUp} subtext="On trial" />
                <StatCard title="Suspended" value={stats.suspended_organisations} icon={PauseCircle} subtext="Access suspended" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Tenant Users" value={stats.total_users} icon={Users} />
                <StatCard title="Platform Admins" value={stats.platform_admins} icon={ShieldCheck} />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Organisations</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="pb-3 text-left font-medium text-muted-foreground">Name</th>
                                    <th className="pb-3 text-left font-medium text-muted-foreground">Plan</th>
                                    <th className="pb-3 text-left font-medium text-muted-foreground">Status</th>
                                    <th className="pb-3 text-left font-medium text-muted-foreground">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recent_organisations?.map((org) => (
                                    <tr key={org.id} className="border-b last:border-0">
                                        <td className="py-3">
                                            <Link
                                                href={`/super-admin/tenants/${org.id}/edit`}
                                                className="font-medium hover:underline"
                                            >
                                                {org.name}
                                            </Link>
                                        </td>
                                        <td className="py-3 capitalize">{org.plan}</td>
                                        <td className="py-3">
                                            <Badge variant={statusVariant(org.status)}>{org.status}</Badge>
                                        </td>
                                        <td className="py-3 text-muted-foreground">
                                            {new Date(org.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                                {!stats.recent_organisations?.length && (
                                    <tr>
                                        <td colSpan={4} className="py-6 text-center text-muted-foreground">
                                            No organisations yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

function TenantDashboard({ stats }: { stats: TenantStats }) {
    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Participants" value={stats.total_participants} icon={Accessibility} />
                <StatCard title="Active Participants" value={stats.active_participants} icon={UserCheck} />
                <StatCard title="Upcoming Shifts" value={stats.upcoming_shifts} icon={CalendarDays} />
                <StatCard title="Shifts This Week" value={stats.shifts_this_week} icon={CalendarDays} subtext="This week" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Unpaid Invoices" value={stats.unpaid_invoices} icon={Receipt} />
                <StatCard title="Open Incidents" value={stats.open_incidents} icon={ShieldAlert} />
                <StatCard title="Staff" value={stats.staff_count} icon={Users} />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Open Incidents</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="pb-3 text-left font-medium text-muted-foreground">Type</th>
                                    <th className="pb-3 text-left font-medium text-muted-foreground">Severity</th>
                                    <th className="pb-3 text-left font-medium text-muted-foreground">Participant</th>
                                    <th className="pb-3 text-left font-medium text-muted-foreground">Occurred</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recent_incidents?.map((incident) => (
                                    <tr key={incident.id} className="border-b last:border-0">
                                        <td className="py-3">
                                            <Link
                                                href={`/incidents/${incident.id}`}
                                                className="font-medium hover:underline capitalize"
                                            >
                                                {incident.incident_type.replace('_', ' ')}
                                            </Link>
                                        </td>
                                        <td className="py-3">
                                            <Badge variant={severityVariant(incident.severity)}>
                                                {incident.severity}
                                            </Badge>
                                        </td>
                                        <td className="py-3">{incident.participant_name}</td>
                                        <td className="py-3 text-muted-foreground">
                                            {incident.occurred_at
                                                ? new Date(incident.occurred_at).toLocaleDateString()
                                                : '—'}
                                        </td>
                                    </tr>
                                ))}
                                {!stats.recent_incidents?.length && (
                                    <tr>
                                        <td colSpan={4} className="py-6 text-center text-muted-foreground">
                                            No open incidents.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

export default function Dashboard({ role, stats }: Props) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                {role === 'super_admin' ? (
                    <SuperAdminDashboard stats={stats as SuperAdminStats} />
                ) : (
                    <TenantDashboard stats={stats as TenantStats} />
                )}
            </div>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]} children={page} />
);
