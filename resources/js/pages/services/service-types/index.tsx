import { Head, Link } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/data-table';
import type { PaginatedResource, ServiceType } from '@/types/models';

const formatCurrency = (value: string | null) =>
    value ? `$${parseFloat(value).toLocaleString('en-AU', { minimumFractionDigits: 2 })}` : '—';

export default function ServiceTypesIndex({
    serviceTypes,
}: {
    serviceTypes: PaginatedResource<ServiceType>;
}) {
    const columns: ColumnDef<ServiceType>[] = [
        {
            accessorKey: 'ndis_support_item_number',
            header: 'Item Number',
            cell: ({ row }) => row.original.ndis_support_item_number ?? '—',
        },
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => (
                <span className="font-medium">{row.original.name}</span>
            ),
        },
        {
            accessorKey: 'support_category',
            header: 'Support Category',
            cell: ({ row }) => row.original.support_category ?? '—',
        },
        {
            accessorKey: 'standard_rate',
            header: 'Standard Rate',
            cell: ({ row }) => formatCurrency(row.original.standard_rate),
        },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: ({ row }) => (
                <Badge variant={row.original.is_active ? 'default' : 'secondary'}>
                    {row.original.is_active ? 'Active' : 'Inactive'}
                </Badge>
            ),
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <Button variant="ghost" size="sm" asChild>
                    <Link href={`/service-types/${row.original.id}/edit`}>Edit</Link>
                </Button>
            ),
        },
    ];

    return (
        <>
            <Head title="Service Types" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Service Types</h1>
                    <Button asChild>
                        <Link href="/service-types/create">
                            <Plus className="mr-2 size-4" />
                            Add Service Type
                        </Link>
                    </Button>
                </div>
                <DataTable
                    columns={columns}
                    data={serviceTypes.data}
                    meta={serviceTypes.meta}
                    searchPlaceholder="Search by name or item number..."
                />
            </div>
        </>
    );
}

ServiceTypesIndex.layout = (page: React.ReactNode) => <AppLayout children={page} />;
