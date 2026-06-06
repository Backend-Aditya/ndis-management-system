import { Head, Link } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/data-table';
import type { PaginatedResource, ServiceAgreement } from '@/types/models';

const statusVariant = (status: string) =>
    ({
        active: 'default',
        draft: 'secondary',
        pending: 'outline',
        expired: 'secondary',
    } as const)[status as 'active' | 'draft' | 'pending' | 'expired'] ?? 'outline';

export default function AgreementsIndex({
    agreements,
}: {
    agreements: PaginatedResource<ServiceAgreement>;
}) {
    const columns: ColumnDef<ServiceAgreement>[] = [
        {
            id: 'participant',
            header: 'Participant',
            cell: ({ row }) =>
                row.original.participant ? (
                    <Link
                        href={`/service-agreements/${row.original.id}`}
                        className="font-medium hover:underline"
                    >
                        {row.original.participant.full_name}
                    </Link>
                ) : (
                    '—'
                ),
        },
        {
            accessorKey: 'agreement_start',
            header: 'Start Date',
            cell: ({ row }) => row.original.agreement_start ?? '—',
        },
        {
            accessorKey: 'agreement_end',
            header: 'End Date',
            cell: ({ row }) => row.original.agreement_end ?? '—',
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
                    <Link href={`/service-agreements/${row.original.id}`}>View</Link>
                </Button>
            ),
        },
    ];

    return (
        <>
            <Head title="Service Agreements" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Service Agreements</h1>
                    <Button asChild>
                        <Link href="/service-agreements/create">
                            <Plus className="mr-2 size-4" />
                            Add Agreement
                        </Link>
                    </Button>
                </div>
                <DataTable
                    columns={columns}
                    data={agreements.data}
                    meta={agreements.meta}
                    searchPlaceholder="Search by participant..."
                />
            </div>
        </>
    );
}

AgreementsIndex.layout = (page: React.ReactNode) => <AppLayout children={page} />;
