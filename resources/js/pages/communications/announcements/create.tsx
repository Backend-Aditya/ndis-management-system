import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';

export default function AnnouncementsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        audience: 'all_staff' as 'all_staff' | 'managers' | 'participants' | 'everyone',
        content: '',
        is_pinned: false,
    });

    return (
        <>
            <Head title="New Announcement" />
            <div className="max-w-3xl space-y-6 p-6">
                <h1 className="text-2xl font-semibold">New Announcement</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/announcements');
                    }}
                    className="space-y-6"
                >
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Announcement title"
                        />
                        <InputError message={errors.title} />
                    </div>

                    {/* Audience */}
                    <div className="space-y-2">
                        <Label>Audience *</Label>
                        <Select
                            value={data.audience}
                            onValueChange={(v) =>
                                setData('audience', v as 'all_staff' | 'managers' | 'participants' | 'everyone')
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all_staff">All Staff</SelectItem>
                                <SelectItem value="managers">Managers</SelectItem>
                                <SelectItem value="participants">Participants</SelectItem>
                                <SelectItem value="everyone">Everyone</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.audience} />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <Label htmlFor="content">Content *</Label>
                        <textarea
                            id="content"
                            className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                            rows={6}
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            placeholder="Write your announcement here..."
                        />
                        <InputError message={errors.content} />
                    </div>

                    {/* Pin toggle */}
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="is_pinned"
                            checked={data.is_pinned}
                            onCheckedChange={(v) => setData('is_pinned', Boolean(v))}
                        />
                        <Label htmlFor="is_pinned">Pin this announcement</Label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>
                            Publish Announcement
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

AnnouncementsCreate.layout = (page: React.ReactNode) => <AppLayout children={page} />;
