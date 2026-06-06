import { Head, Link, router } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { Pin, Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/data-table';
import type { Announcement, PaginatedResource } from '@/types/models';

export default function AnnouncementsIndex({ announcements }: { announcements: PaginatedResource<Announcement> }) {
    const columns: ColumnDef<Announcement>[] = [
        {
            accessorKey: 'title',
            header: 'Title',
            cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
        },
        {
            accessorKey: 'audience',
            header: 'Audience',
            cell: ({ row }) => (
                <Badge variant="secondary">{row.original.audience.replace(/_/g, ' ')}</Badge>
            ),
        },
        {
            accessorKey: 'is_pinned',
            header: 'Pinned',
            cell: ({ row }) =>
                row.original.is_pinned ? (
                    <Badge variant="outline">
                        <Pin className="mr-1 size-3" />
                        Pinned
                    </Badge>
                ) : (
                    '—'
                ),
        },
        {
            accessorKey: 'creator',
            header: 'Created By',
            cell: ({ row }) => row.original.creator?.full_name ?? '—',
        },
        {
            accessorKey: 'created_at',
            header: 'Date',
            cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.patch(`/announcements/${row.original.id}/toggle-pin`)}
                    >
                        <Pin className="size-4" />
                        {row.original.is_pinned ? 'Unpin' : 'Pin'}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            if (confirm('Delete this announcement? This cannot be undone.')) {
                                router.delete(`/announcements/${row.original.id}`);
                            }
                        }}
                    >
                        <Trash2 className="size-4 text-destructive" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Announcements" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Announcements</h1>
                    <Button asChild>
                        <Link href="/announcements/create">
                            <Plus className="mr-2 size-4" />
                            New Announcement
                        </Link>
                    </Button>
                </div>
                <DataTable
                    columns={columns}
                    data={announcements.data}
                    meta={announcements.meta}
                    searchPlaceholder="Search announcements..."
                />
            </div>
        </>
    );
}

AnnouncementsIndex.layout = (page: React.ReactNode) => <AppLayout children={page} />;
