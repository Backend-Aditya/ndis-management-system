import { Head, router } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/data-table';
import type { NdisClaim, PaginatedResource } from '@/types/models';

const statusVariant = (status: string) =>
    ({
        pending: 'secondary',
        submitted: 'default',
        rejected: 'destructive',
        paid: 'outline',
    } as const)[status as 'pending' | 'submitted' | 'rejected' | 'paid'] ?? 'outline';

const formatCurrency = (value: string) => `$${parseFloat(value).toFixed(2)}`;

export default function ClaimsIndex({ claims }: { claims: PaginatedResource<NdisClaim> }) {
    const columns: ColumnDef<NdisClaim>[] = [
        {
            accessorKey: 'claim_reference',
            header: 'Claim Reference',
            cell: ({ row }) => row.original.claim_reference ?? '—',
        },
        {
            id: 'invoice',
            header: 'Invoice',
            cell: ({ row }) => row.original.invoice?.invoice_number ?? '—',
        },
        {
            accessorKey: 'claim_type',
            header: 'Claim Type',
        },
        {
            accessorKey: 'claim_amount',
            header: 'Amount',
            cell: ({ row }) => formatCurrency(row.original.claim_amount),
        },
        {
            accessorKey: 'submission_status',
            header: 'Status',
            cell: ({ row }) => (
                <Badge variant={statusVariant(row.original.submission_status)}>
                    {row.original.submission_status}
                </Badge>
            ),
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    {row.original.submission_status === 'pending' && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.patch(`/claims/${row.original.id}/submit`)}
                        >
                            Submit
                        </Button>
                    )}
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                            if (confirm('Delete this claim? This cannot be undone.')) {
                                router.delete(`/claims/${row.original.id}`);
                            }
                        }}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="NDIS Claims" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">NDIS Claims</h1>
                </div>
                <DataTable
                    columns={columns}
                    data={claims.data}
                    meta={claims.meta}
                    searchPlaceholder="Search claims..."
                />
            </div>
        </>
    );
}

ClaimsIndex.layout = (page: React.ReactNode) => <AppLayout children={page} />;
