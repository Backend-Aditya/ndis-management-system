import { Head, Link } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/data-table';
import type { NdisPlan, PaginatedResource } from '@/types/models';

const statusVariant = (status: string) =>
    ({ active: 'default', expired: 'secondary', pending: 'outline' } as const)[
        status as 'active' | 'expired' | 'pending'
    ] ?? 'outline';

const formatCurrency = (value: string | null) =>
    value ? `$${parseFloat(value).toLocaleString('en-AU', { minimumFractionDigits: 2 })}` : '—';

const formatManagementType = (type: string) => type.replace(/_/g, ' ');

export default function PlansIndex({ plans }: { plans: PaginatedResource<NdisPlan> }) {
    const columns: ColumnDef<NdisPlan>[] = [
        {
            accessorKey: 'plan_number',
            header: 'Plan Number',
            cell: ({ row }) => row.original.plan_number ?? '—',
        },
        {
            id: 'participant',
            header: 'Participant',
            cell: ({ row }) =>
                row.original.participant ? (
                    <Link
                        href={`/participants/${row.original.participant.id}`}
                        className="font-medium hover:underline"
                    >
                        {row.original.participant.full_name}
                    </Link>
                ) : (
                    '—'
                ),
        },
        {
            accessorKey: 'plan_start_date',
            header: 'Start Date',
            cell: ({ row }) => row.original.plan_start_date ?? '—',
        },
        {
            accessorKey: 'plan_end_date',
            header: 'End Date',
            cell: ({ row }) => row.original.plan_end_date ?? '—',
        },
        {
            accessorKey: 'total_funding',
            header: 'Total Funding',
            cell: ({ row }) => formatCurrency(row.original.total_funding),
        },
        {
            accessorKey: 'management_type',
            header: 'Management Type',
            cell: ({ row }) => (
                <span className="capitalize">{formatManagementType(row.original.management_type)}</span>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <Badge variant={statusVariant(row.original.status)}>{row.original.status}</Badge>
            ),
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <Button variant="ghost" size="sm" asChild>
                    <Link href={`/plans/${row.original.id}`}>View</Link>
                </Button>
            ),
        },
    ];

    return (
        <>
            <Head title="Plans" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">NDIS Plans</h1>
                    <Button asChild>
                        <Link href="/plans/create">
                            <Plus className="mr-2 size-4" />
                            Add Plan
                        </Link>
                    </Button>
                </div>
                <DataTable
                    columns={columns}
                    data={plans.data}
                    meta={plans.meta}
                    searchPlaceholder="Search by plan number or participant..."
                />
            </div>
        </>
    );
}

PlansIndex.layout = (page: React.ReactNode) => <AppLayout children={page} />;
