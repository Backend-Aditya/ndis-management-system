import { Head, Link, router } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/data-table';
import type { PaginatedResource, RiskAssessment } from '@/types/models';

const riskLevelVariant = (level: string) =>
    ({
        low: 'secondary',
        medium: 'outline',
        high: 'default',
        extreme: 'destructive',
    } as const)[level as 'low' | 'medium' | 'high' | 'extreme'] ?? 'outline';

export default function RiskAssessmentsIndex({ assessments }: { assessments: PaginatedResource<RiskAssessment> }) {
    const columns: ColumnDef<RiskAssessment>[] = [
        {
            accessorKey: 'participant',
            header: 'Participant',
            cell: ({ row }) => row.original.participant?.full_name ?? '—',
        },
        {
            accessorKey: 'risk_area',
            header: 'Risk Area',
        },
        {
            accessorKey: 'likelihood',
            header: 'Likelihood',
            cell: ({ row }) => row.original.likelihood.replace(/_/g, ' '),
        },
        {
            accessorKey: 'impact',
            header: 'Impact',
            cell: ({ row }) => row.original.impact.replace(/_/g, ' '),
        },
        {
            accessorKey: 'risk_level',
            header: 'Risk Level',
            cell: ({ row }) => (
                <Badge variant={riskLevelVariant(row.original.risk_level)}>
                    {row.original.risk_level}
                </Badge>
            ),
        },
        {
            accessorKey: 'review_date',
            header: 'Review Date',
            cell: ({ row }) => row.original.review_date ?? '—',
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                        if (confirm('Delete this risk assessment? This cannot be undone.')) {
                            router.delete(`/risk-assessments/${row.original.id}`);
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
            <Head title="Risk Assessments" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Risk Assessments</h1>
                    <Button asChild>
                        <Link href="/risk-assessments/create">
                            <Plus className="mr-2 size-4" />
                            New Assessment
                        </Link>
                    </Button>
                </div>
                <DataTable
                    columns={columns}
                    data={assessments.data}
                    meta={assessments.meta}
                    searchPlaceholder="Search risk assessments..."
                />
            </div>
        </>
    );
}

RiskAssessmentsIndex.layout = (page: React.ReactNode) => <AppLayout children={page} />;
