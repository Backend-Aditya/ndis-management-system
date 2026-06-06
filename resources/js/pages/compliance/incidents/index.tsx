import { Head, Link } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/data-table';
import type { Incident, PaginatedResource } from '@/types/models';

const severityVariant = (severity: string) =>
    ({
        low: 'secondary',
        medium: 'outline',
        high: 'default',
        critical: 'destructive',
    } as const)[severity as 'low' | 'medium' | 'high' | 'critical'] ?? 'outline';

const statusVariant = (status: string) =>
    ({
        open: 'destructive',
        investigating: 'secondary',
        closed: 'default',
    } as const)[status as 'open' | 'investigating' | 'closed'] ?? 'outline';

const formatDatetime = (value: string | null) => {
    if (!value) return '—';
    return new Date(value).toLocaleString();
};

export default function IncidentsIndex({ incidents }: { incidents: PaginatedResource<Incident> }) {
    const columns: ColumnDef<Incident>[] = [
        {
            accessorKey: 'participant',
            header: 'Participant',
            cell: ({ row }) => (
                <Link href={`/incidents/${row.original.id}`} className="font-medium hover:underline">
                    {row.original.participant?.full_name ?? '—'}
                </Link>
            ),
        },
        {
            accessorKey: 'incident_type',
            header: 'Incident Type',
            cell: ({ row }) => row.original.incident_type.replace(/_/g, ' '),
        },
        {
            accessorKey: 'severity',
            header: 'Severity',
            cell: ({ row }) => (
                <Badge variant={severityVariant(row.original.severity)}>
                    {row.original.severity}
                </Badge>
            ),
        },
        {
            accessorKey: 'occurred_at',
            header: 'Occurred At',
            cell: ({ row }) => formatDatetime(row.original.occurred_at),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <Badge variant={statusVariant(row.original.status)}>
                    {row.original.status.replace('_', ' ')}
                </Badge>
            ),
        },
    ];

    return (
        <>
            <Head title="Incidents" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Incidents</h1>
                    <Button asChild>
                        <Link href="/incidents/create">
                            <Plus className="mr-2 size-4" />
                            Report Incident
                        </Link>
                    </Button>
                </div>
                <DataTable
                    columns={columns}
                    data={incidents.data}
                    meta={incidents.meta}
                    searchPlaceholder="Search incidents..."
                />
            </div>
        </>
    );
}

IncidentsIndex.layout = (page: React.ReactNode) => <AppLayout children={page} />;
