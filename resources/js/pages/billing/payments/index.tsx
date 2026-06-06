import { Head } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-table/data-table';
import type { PaginatedResource, Payment } from '@/types/models';

const formatCurrency = (value: string) => `$${parseFloat(value).toFixed(2)}`;

const formatDate = (value: string | null) => {
    if (!value) return '—';
    return new Date(value).toLocaleDateString();
};

export default function PaymentsIndex({ payments }: { payments: PaginatedResource<Payment> }) {
    const columns: ColumnDef<Payment>[] = [
        {
            id: 'invoice',
            header: 'Invoice',
            cell: ({ row }) => row.original.invoice?.invoice_number ?? '—',
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => formatCurrency(row.original.amount),
        },
        {
            accessorKey: 'payment_method',
            header: 'Method',
            cell: ({ row }) => row.original.payment_method.replace('_', ' '),
        },
        {
            accessorKey: 'payer_name',
            header: 'Payer',
            cell: ({ row }) => row.original.payer_name ?? '—',
        },
        {
            accessorKey: 'payment_date',
            header: 'Payment Date',
            cell: ({ row }) => formatDate(row.original.payment_date),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <Badge variant="outline">{row.original.status}</Badge>
            ),
        },
    ];

    return (
        <>
            <Head title="Payments" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Payments</h1>
                </div>
                <DataTable
                    columns={columns}
                    data={payments.data}
                    meta={payments.meta}
                    searchPlaceholder="Search payments..."
                />
            </div>
        </>
    );
}

PaymentsIndex.layout = (page: React.ReactNode) => <AppLayout children={page} />;
