import { Head, router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Message } from '@/types/models';

const messageTypeVariant = (type: string) =>
    ({
        general: 'secondary',
        urgent: 'destructive',
        reminder: 'outline',
    } as const)[type as 'general' | 'urgent' | 'reminder'] ?? 'outline';

export default function MessagesShow({ message }: { message: Message }) {
    return (
        <>
            <Head title={message.subject} />
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold">{message.subject}</h1>
                        <div className="flex items-center gap-2">
                            <Badge variant={messageTypeVariant(message.message_type)}>{message.message_type}</Badge>
                            {message.is_broadcast ? (
                                <Badge variant="default">Broadcast</Badge>
                            ) : (
                                <Badge variant="outline">Direct</Badge>
                            )}
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            if (confirm('Delete this message? This cannot be undone.')) {
                                router.delete(`/messages/${message.id}`);
                            }
                        }}
                    >
                        <Trash2 className="size-4 text-destructive" />
                    </Button>
                </div>

                {/* Details Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Message Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div>
                            <span className="text-muted-foreground">From:</span>{' '}
                            {message.sender?.full_name ?? '—'}
                        </div>
                        <div>
                            <span className="text-muted-foreground">Sent:</span>{' '}
                            {new Date(message.created_at).toLocaleDateString()}
                        </div>
                        {!message.is_broadcast && (
                            <div>
                                <span className="text-muted-foreground">Recipients:</span>{' '}
                                {message.recipient_count ?? '—'}
                            </div>
                        )}
                        <div className="pt-2">
                            <p className="text-muted-foreground mb-1">Body:</p>
                            <p className="whitespace-pre-wrap">{message.body}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

MessagesShow.layout = (page: React.ReactNode) => <AppLayout children={page} />;
