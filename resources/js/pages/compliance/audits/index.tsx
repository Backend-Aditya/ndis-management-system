import { Head, Link, router } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/data-table';
import type { Audit, PaginatedResource } from '@/types/models';

const outcomeVariant = (outcome: string | null) => {
    if (!outcome) return 'outline' as const;
    return ({
        pass: 'default',
        conditional: 'secondary',
        minor_nc: 'outline',
        major_nc: 'destructive',
    } as const)[outcome as 'pass' | 'conditional' | 'minor_nc' | 'major_nc'] ?? 'outline';
};

const statusVariant = (status: string) =>
    ({
        scheduled: 'secondary',
        in_progress: 'default',
        completed: 'outline',
    } as const)[status as 'scheduled' | 'in_progress' | 'completed'] ?? 'outline';

export default function AuditsIndex({ audits }: { audits: PaginatedResource<Audit> }) {
    const columns: ColumnDef<Audit>[] = [
        {
            accessorKey: 'audit_type',
            header: 'Audit Type',
            cell: ({ row }) => row.original.audit_type.replace(/_/g, ' '),
        },
        {
            accessorKey: 'auditor_name',
            header: 'Auditor',
        },
        {
            accessorKey: 'audit_date',
            header: 'Audit Date',
            cell: ({ row }) => row.original.audit_date ?? '—',
        },
        {
            accessorKey: 'next_audit_date',
            header: 'Next Audit Date',
            cell: ({ row }) => row.original.next_audit_date ?? '—',
        },
        {
            accessorKey: 'outcome',
            header: 'Outcome',
            cell: ({ row }) =>
                row.original.outcome ? (
                    <Badge variant={outcomeVariant(row.original.outcome)}>
                        {row.original.outcome.replace(/_/g, ' ')}
                    </Badge>
                ) : (
                    '—'
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
                        if (confirm('Delete this audit? This cannot be undone.')) {
                            router.delete(`/audits/${row.original.id}`);
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
            <Head title="Audits" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Audits</h1>
                    <Button asChild>
                        <Link href="/audits/create">
                            <Plus className="mr-2 size-4" />
                            Record Audit
                        </Link>
                    </Button>
                </div>
                <DataTable
                    columns={columns}
                    data={audits.data}
                    meta={audits.meta}
                    searchPlaceholder="Search audits..."
                />
            </div>
        </>
    );
}

AuditsIndex.layout = (page: React.ReactNode) => <AppLayout children={page} />;
