import { Head, Link } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/data-table';
import type { Message, PaginatedResource } from '@/types/models';

const messageTypeVariant = (type: string) =>
    ({
        general: 'secondary',
        urgent: 'destructive',
        reminder: 'outline',
    } as const)[type as 'general' | 'urgent' | 'reminder'] ?? 'outline';

export default function MessagesIndex({ messages }: { messages: PaginatedResource<Message> }) {
    const columns: ColumnDef<Message>[] = [
        {
            accessorKey: 'subject',
            header: 'Subject',
            cell: ({ row }) => (
                <Link href={`/messages/${row.original.id}`} className="font-medium hover:underline">
                    {row.original.subject}
                </Link>
            ),
        },
        {
            accessorKey: 'sender',
            header: 'Sender',
            cell: ({ row }) => row.original.sender?.full_name ?? '—',
        },
        {
            accessorKey: 'message_type',
            header: 'Type',
            cell: ({ row }) => (
                <Badge variant={messageTypeVariant(row.original.message_type)}>
                    {row.original.message_type}
                </Badge>
            ),
        },
        {
            accessorKey: 'is_broadcast',
            header: 'Scope',
            cell: ({ row }) =>
                row.original.is_broadcast ? (
                    <Badge variant="default">Broadcast</Badge>
                ) : (
                    <Badge variant="outline">Direct</Badge>
                ),
        },
        {
            accessorKey: 'recipient_count',
            header: 'Recipients',
            cell: ({ row }) => row.original.recipient_count ?? '—',
        },
        {
            accessorKey: 'created_at',
            header: 'Sent',
            cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
        },
    ];

    return (
        <>
            <Head title="Messages" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Messages</h1>
                    <Button asChild>
                        <Link href="/messages/create">
                            <Plus className="mr-2 size-4" />
                            New Message
                        </Link>
                    </Button>
                </div>
                <DataTable
                    columns={columns}
                    data={messages.data}
                    meta={messages.meta}
                    searchPlaceholder="Search messages..."
                />
            </div>
        </>
    );
}

MessagesIndex.layout = (page: React.ReactNode) => <AppLayout children={page} />;
