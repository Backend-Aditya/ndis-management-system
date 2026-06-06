import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import type { User } from '@/types/models';

interface Props {
    users: { data: User[] };
}

export default function MessagesCreate({ users }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        subject: '',
        message_type: 'general' as 'general' | 'urgent' | 'reminder',
        is_broadcast: false,
        body: '',
        recipient_ids: [] as string[],
    });

    const toggleRecipient = (id: string) => {
        setData(
            'recipient_ids',
            data.recipient_ids.includes(id)
                ? data.recipient_ids.filter((r) => r !== id)
                : [...data.recipient_ids, id],
        );
    };

    return (
        <>
            <Head title="New Message" />
            <div className="max-w-3xl space-y-6 p-6">
                <h1 className="text-2xl font-semibold">New Message</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/messages');
                    }}
                    className="space-y-6"
                >
                    {/* Subject */}
                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                            id="subject"
                            value={data.subject}
                            onChange={(e) => setData('subject', e.target.value)}
                            placeholder="Message subject"
                        />
                        <InputError message={errors.subject} />
                    </div>

                    {/* Message Type */}
                    <div className="space-y-2">
                        <Label>Message Type *</Label>
                        <Select
                            value={data.message_type}
                            onValueChange={(v) => setData('message_type', v as 'general' | 'urgent' | 'reminder')}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="general">General</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                                <SelectItem value="reminder">Reminder</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.message_type} />
                    </div>

                    {/* Broadcast toggle */}
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="is_broadcast"
                            checked={data.is_broadcast}
                            onCheckedChange={(v) => setData('is_broadcast', Boolean(v))}
                        />
                        <Label htmlFor="is_broadcast">Send to all staff</Label>
                    </div>

                    {/* Recipients — shown only when not broadcast */}
                    {!data.is_broadcast && (
                        <div className="space-y-2">
                            <Label>Recipients *</Label>
                            <div className="max-h-56 space-y-2 overflow-y-auto rounded-md border p-3">
                                {users.data.map((user) => (
                                    <div key={user.id} className="flex items-center gap-2">
                                        <Checkbox
                                            id={`recipient-${user.id}`}
                                            checked={data.recipient_ids.includes(user.id)}
                                            onCheckedChange={() => toggleRecipient(user.id)}
                                        />
                                        <Label htmlFor={`recipient-${user.id}`} className="cursor-pointer font-normal">
                                            {user.full_name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            <InputError message={errors.recipient_ids} />
                        </div>
                    )}

                    {/* Body */}
                    <div className="space-y-2">
                        <Label htmlFor="body">Message *</Label>
                        <textarea
                            id="body"
                            className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                            rows={6}
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            placeholder="Write your message here..."
                        />
                        <InputError message={errors.body} />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>
                            Send Message
                        </Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

MessagesCreate.layout = (page: React.ReactNode) => <AppLayout children={page} />;
