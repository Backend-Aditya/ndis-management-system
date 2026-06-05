import { Head, Link } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/data-table';
import type { PaginatedResource, User } from '@/types/models';

export default function StaffIndex({ staff }: { staff: PaginatedResource<User> }) {
    const columns: ColumnDef<User>[] = [
        {
            accessorKey: 'full_name', header: 'Name',
            cell: ({ row }) => (
                <Link href={`/staff/${row.original.id}`} className="font-medium hover:underline">
                    {row.original.full_name}
                </Link>
            ),
        },
        { accessorKey: 'email', header: 'Email' },
        { accessorKey: 'phone', header: 'Phone' },
        {
            accessorKey: 'roles', header: 'Role',
            cell: ({ row }) => (
                <Badge variant="outline">{row.original.roles[0]?.replace('_', ' ')}</Badge>
            ),
        },
        {
            accessorKey: 'is_active', header: 'Status',
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
                    <Link href={`/staff/${row.original.id}/edit`}>Edit</Link>
                </Button>
            ),
        },
    ];

    return (
        <>
            <Head title="Staff" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Staff</h1>
                    <Button asChild>
                        <Link href="/staff/create"><Plus className="size-4 mr-2" />Add Staff</Link>
                    </Button>
                </div>
                <DataTable columns={columns} data={staff.data} meta={staff.meta} searchPlaceholder="Search staff..." />
            </div>
        </>
    );
}
StaffIndex.layout = (page: React.ReactNode) => <AppLayout children={page} />;
