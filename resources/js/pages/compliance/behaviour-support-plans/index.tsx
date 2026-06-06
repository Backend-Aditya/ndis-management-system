import { Head, Link, router } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/data-table';
import type { BehaviourSupportPlan, PaginatedResource } from '@/types/models';

const statusVariant = (status: string) =>
    ({
        active: 'default',
        under_review: 'secondary',
        expired: 'outline',
    } as const)[status as 'active' | 'under_review' | 'expired'] ?? 'outline';

export default function BehaviourSupportPlansIndex({ plans }: { plans: PaginatedResource<BehaviourSupportPlan> }) {
    const columns: ColumnDef<BehaviourSupportPlan>[] = [
        {
            accessorKey: 'participant',
            header: 'Participant',
            cell: ({ row }) => row.original.participant?.full_name ?? '—',
        },
        {
            accessorKey: 'plan_date',
            header: 'Plan Date',
            cell: ({ row }) => row.original.plan_date ?? '—',
        },
        {
            accessorKey: 'review_date',
            header: 'Review Date',
            cell: ({ row }) => row.original.review_date ?? '—',
        },
        {
            accessorKey: 'uses_restrictive_practices',
            header: 'Restrictive Practices',
            cell: ({ row }) => (
                <Badge variant={row.original.uses_restrictive_practices ? 'destructive' : 'secondary'}>
                    {row.original.uses_restrictive_practices ? 'Yes' : 'No'}
                </Badge>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <Badge variant={statusVariant(row.original.status)}>
                    {row.original.status.replace('_', ' ')}
                </Badge>
            ),
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                        if (confirm('Delete this behaviour support plan? This cannot be undone.')) {
                            router.delete(`/behaviour-support-plans/${row.original.id}`);
                        }
                    }}
                >
                    <Trash2 className="text-destructive size-4" />
                </Button>
            ),
        },
    ];

    return (
        <>
            <Head title="Behaviour Support Plans" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Behaviour Support Plans</h1>
                    <Button asChild>
                        <Link href="/behaviour-support-plans/create">
                            <Plus className="mr-2 size-4" />
                            New Plan
                        </Link>
                    </Button>
                </div>
                <DataTable
                    columns={columns}
                    data={plans.data}
                    meta={plans.meta}
                    searchPlaceholder="Search behaviour support plans..."
                />
            </div>
        </>
    );
}

BehaviourSupportPlansIndex.layout = (page: React.ReactNode) => <AppLayout children={page} />;
