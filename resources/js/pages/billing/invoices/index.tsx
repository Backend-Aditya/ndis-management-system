import { Head, Link } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/data-table';
import type { Invoice, PaginatedResource } from '@/types/models';

const statusVariant = (status: string) =>
    ({
        draft: 'secondary',
        sent: 'outline',
        paid: 'default',
        overdue: 'destructive',
    } as const)[status as 'draft' | 'sent' | 'paid' | 'overdue'] ?? 'outline';

const formatCurrency = (value: string) =>
    `$${parseFloat(value).toFixed(2)}`;

const formatDate = (value: string | null) => {
    if (!value) return '—';
    return new Date(value).toLocaleDateString();
};

export default function InvoicesIndex({ invoices }: { invoices: PaginatedResource<Invoice> }) {
    const columns: ColumnDef<Invoice>[] = [
        {
            accessorKey: 'invoice_number',
            header: 'Invoice #',
            cell: ({ row }) => (
                <Link href={`/invoices/${row.original.id}`} className="font-medium hover:underline">
                    {row.original.invoice_number}
                </Link>
            ),
        },
        {
            id: 'participant',
            header: 'Participant',
            cell: ({ row }) => row.original.participant?.full_name ?? '—',
        },
        {
            accessorKey: 'invoice_date',
            header: 'Invoice Date',
            cell: ({ row }) => formatDate(row.original.invoice_date),
        },
        {
            accessorKey: 'total_amount',
            header: 'Total',
            cell: ({ row }) => formatCurrency(row.original.total_amount),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <Badge variant={statusVariant(row.original.status)}>
                    {row.original.status}
                </Badge>
            ),
        },
    ];

    return (
        <>
            <Head title="Invoices" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Invoices</h1>
                    <Button asChild>
                        <Link href="/invoices/create">
                            <Plus className="mr-2 size-4" />
                            Create Invoice
                        </Link>
                    </Button>
                </div>
                <DataTable
                    columns={columns}
                    data={invoices.data}
                    meta={invoices.meta}
                    searchPlaceholder="Search invoices..."
                />
            </div>
        </>
    );
}

InvoicesIndex.layout = (page: React.ReactNode) => <AppLayout children={page} />;
