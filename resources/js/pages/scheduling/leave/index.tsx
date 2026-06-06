import { Head, Link, router } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/data-table';
import type { PaginatedResource, LeaveRequest } from '@/types/models';

const leaveTypeVariant = (leaveType: string) =>
    ({
        annual: 'default',
        sick: 'secondary',
        personal: 'outline',
        unpaid: 'destructive',
    } as const)[leaveType as 'annual' | 'sick' | 'personal' | 'unpaid'] ?? 'outline';

const statusVariant = (status: string) =>
    ({
        pending: 'secondary',
        approved: 'default',
        rejected: 'destructive',
    } as const)[status as 'pending' | 'approved' | 'rejected'] ?? 'outline';

export default function LeaveIndex({ leaveRequests }: { leaveRequests: PaginatedResource<LeaveRequest> }) {
    const columns: ColumnDef<LeaveRequest>[] = [
        {
            accessorKey: 'staff',
            header: 'Staff',
            cell: ({ row }) => row.original.staff?.full_name ?? '—',
        },
        {
            accessorKey: 'leave_type',
            header: 'Leave Type',
            cell: ({ row }) => (
                <Badge variant={leaveTypeVariant(row.original.leave_type)}>
                    {row.original.leave_type}
                </Badge>
            ),
        },
        {
            accessorKey: 'start_date',
            header: 'Start Date',
            cell: ({ row }) => row.original.start_date ?? '—',
        },
        {
            accessorKey: 'end_date',
            header: 'End Date',
            cell: ({ row }) => row.original.end_date ?? '—',
        },
        {
            accessorKey: 'hours',
            header: 'Hours',
            cell: ({ row }) => row.original.hours ?? '—',
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
        {
            id: 'actions',
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    {row.original.status === 'pending' && (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.patch(`/leave/${row.original.id}/approve`)}
                            >
                                Approve
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.patch(`/leave/${row.original.id}/reject`)}
                            >
                                Reject
                            </Button>
                        </>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            if (confirm('Delete this leave request?')) {
                                router.delete(`/leave/${row.original.id}`);
                            }
                        }}
                    >
                        <Trash2 className="text-destructive size-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Leave Requests" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Leave Requests</h1>
                    <Button asChild>
                        <Link href="/leave/create">
                            <Plus className="mr-2 size-4" />
                            Request Leave
                        </Link>
                    </Button>
                </div>
                <DataTable
                    columns={columns}
                    data={leaveRequests.data}
                    meta={leaveRequests.meta}
                    searchPlaceholder="Search leave requests..."
                />
            </div>
        </>
    );
}

LeaveIndex.layout = (page: React.ReactNode) => <AppLayout children={page} />;
