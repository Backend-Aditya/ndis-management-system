import { Head } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-table/data-table';
import type { AuditLog, PaginatedResource } from '@/types/models';

export default function AuditLogsIndex({ logs }: { logs: PaginatedResource<AuditLog> }) {
    const columns: ColumnDef<AuditLog>[] = [
        {
            accessorKey: 'created_at',
            header: 'Date / Time',
            cell: ({ row }) => new Date(row.original.created_at).toLocaleString(),
        },
        {
            accessorKey: 'user',
            header: 'User',
            cell: ({ row }) => row.original.user?.full_name ?? 'System',
        },
        {
            accessorKey: 'action',
            header: 'Action',
            cell: ({ row }) => <Badge variant="outline">{row.original.action}</Badge>,
        },
        {
            accessorKey: 'resource_type',
            header: 'Resource',
            cell: ({ row }) => row.original.resource_type,
        },
        {
            accessorKey: 'ip_address',
            header: 'IP Address',
            cell: ({ row }) => row.original.ip_address ?? '—',
        },
    ];

    return (
        <>
            <Head title="Audit Logs" />
            <div className="space-y-6 p-6">
                <h1 className="text-2xl font-semibold">Audit Logs</h1>
                <DataTable
                    columns={columns}
                    data={logs.data}
                    meta={logs.meta}
                    searchPlaceholder="Search audit logs..."
                />
            </div>
        </>
    );
}

AuditLogsIndex.layout = (page: React.ReactNode) => <AppLayout children={page} />;
