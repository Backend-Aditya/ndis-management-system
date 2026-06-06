import { Head, Link } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/data-table';
import type { PaginatedResource, Shift } from '@/types/models';

const statusVariant = (status: string) =>
    ({
        scheduled: 'default',
        in_progress: 'secondary',
        completed: 'outline',
        cancelled: 'destructive',
    } as const)[status as 'scheduled' | 'in_progress' | 'completed' | 'cancelled'] ?? 'outline';

const formatDatetime = (value: string | null) => {
    if (!value) return '—';
    return new Date(value).toLocaleString();
};

export default function ShiftsIndex({ shifts }: { shifts: PaginatedResource<Shift> }) {
    const columns: ColumnDef<Shift>[] = [
        {
            accessorKey: 'participant',
            header: 'Participant',
            cell: ({ row }) => (
                <Link href={`/shifts/${row.original.id}`} className="font-medium hover:underline">
                    {row.original.participant?.full_name ?? '—'}
                </Link>
            ),
        },
        {
            accessorKey: 'staff',
            header: 'Staff',
            cell: ({ row }) => row.original.staff?.full_name ?? '—',
        },
        {
            accessorKey: 'service_type',
            header: 'Service Type',
            cell: ({ row }) => row.original.service_type?.name ?? '—',
        },
        {
            accessorKey: 'scheduled_start',
            header: 'Scheduled Start',
            cell: ({ row }) => formatDatetime(row.original.scheduled_start),
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
        {
            id: 'actions',
            cell: ({ row }) => (
                <Button variant="ghost" size="sm" asChild>
                    <Link href={`/shifts/${row.original.id}/edit`}>Edit</Link>
                </Button>
            ),
        },
    ];

    return (
        <>
            <Head title="Shifts" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Shifts</h1>
                    <Button asChild>
                        <Link href="/shifts/create">
                            <Plus className="mr-2 size-4" />
                            Schedule Shift
                        </Link>
                    </Button>
                </div>
                <DataTable
                    columns={columns}
                    data={shifts.data}
                    meta={shifts.meta}
                    searchPlaceholder="Search shifts..."
                />
            </div>
        </>
    );
}

ShiftsIndex.layout = (page: React.ReactNode) => <AppLayout children={page} />;
