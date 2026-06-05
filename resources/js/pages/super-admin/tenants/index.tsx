import { Head, Link, router } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/data-table';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import SuperAdminLayout from '@/layouts/super-admin-layout';
import type { PaginatedResource, Tenant } from '@/types/models';

const statusVariant = (status: string) =>
    ({ active: 'default', trialing: 'secondary', suspended: 'destructive' } as const)[status as 'active' | 'trialing' | 'suspended'] ?? 'outline';

export default function TenantsIndex({ tenants }: { tenants: PaginatedResource<Tenant> }) {
    const columns: ColumnDef<Tenant>[] = [
        { accessorKey: 'name', header: 'Organisation' },
        { accessorKey: 'contact_email', header: 'Email' },
        { accessorKey: 'plan', header: 'Plan' },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <Badge variant={statusVariant(row.original.status)}>
                    {row.original.status}
                </Badge>
            ),
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="size-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`/super-admin/tenants/${row.original.id}/edit`}>Edit</Link>
                        </DropdownMenuItem>
                        {row.original.status !== 'suspended' ? (
                            <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => router.patch(`/super-admin/tenants/${row.original.id}/suspend`)}
                            >
                                Suspend
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem
                                onClick={() => router.patch(`/super-admin/tenants/${row.original.id}/activate`)}
                            >
                                Activate
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                                if (confirm('Delete this tenant?'))
                                    router.delete(`/super-admin/tenants/${row.original.id}`);
                            }}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <>
            <Head title="Tenants" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Tenants</h1>
                    <Button asChild>
                        <Link href="/super-admin/tenants/create"><Plus className="size-4 mr-2" />Add Tenant</Link>
                    </Button>
                </div>
                <DataTable columns={columns} data={tenants.data} meta={tenants.meta} searchPlaceholder="Search organisations..." />
            </div>
        </>
    );
}

TenantsIndex.layout = (page: React.ReactNode) => <SuperAdminLayout>{page}</SuperAdminLayout>;
