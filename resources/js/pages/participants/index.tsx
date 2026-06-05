import { Head, Link } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/data-table';
import type { PaginatedResource, Participant } from '@/types/models';

const statusVariant = (status: string) =>
    ({ active: 'default', inactive: 'secondary', pending: 'outline' } as const)[status as 'active' | 'inactive' | 'pending'] ?? 'outline';

export default function ParticipantsIndex({ participants }: { participants: PaginatedResource<Participant> }) {
    const columns: ColumnDef<Participant>[] = [
        { accessorKey: 'ndis_number', header: 'NDIS Number' },
        {
            accessorKey: 'full_name',
            header: 'Name',
            cell: ({ row }) => (
                <Link href={`/participants/${row.original.id}`} className="font-medium hover:underline">
                    {row.original.full_name}
                </Link>
            ),
        },
        { accessorKey: 'suburb', header: 'Suburb' },
        { accessorKey: 'state', header: 'State' },
        {
            accessorKey: 'participant_status',
            header: 'Status',
            cell: ({ row }) => (
                <Badge variant={statusVariant(row.original.participant_status)}>
                    {row.original.participant_status}
                </Badge>
            ),
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <Button variant="ghost" size="sm" asChild>
                    <Link href={`/participants/${row.original.id}/edit`}>Edit</Link>
                </Button>
            ),
        },
    ];

    return (
        <>
            <Head title="Participants" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Participants</h1>
                    <Button asChild>
                        <Link href="/participants/create">
                            <Plus className="mr-2 size-4" />
                            Add Participant
                        </Link>
                    </Button>
                </div>
                <DataTable
                    columns={columns}
                    data={participants.data}
                    meta={participants.meta}
                    searchPlaceholder="Search by name or NDIS number..."
                />
            </div>
        </>
    );
}

ParticipantsIndex.layout = (page: React.ReactNode) => <AppLayout children={page} />;
