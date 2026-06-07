import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormSection } from '@/components/form/form-section';
import { FormField } from '@/components/form/form-field';
import { FormActions } from '@/components/form/form-actions';

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
                    <FormSection title="Announcement">
                        <FormField label="Title" htmlFor="title" error={errors.title} required full>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Announcement title"
                            />
                        </FormField>
                        <FormField label="Audience" error={errors.audience} required>
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
                        </FormField>
                        <div className="flex items-center gap-2 sm:col-span-2">
                            <Checkbox
                                id="is_pinned"
                                checked={data.is_pinned}
                                onCheckedChange={(v) => setData('is_pinned', Boolean(v))}
                            />
                            <Label htmlFor="is_pinned">Pin this announcement</Label>
                        </div>
                        <FormField label="Content" htmlFor="content" error={errors.content} required full>
                            <textarea
                                id="content"
                                className="border-input bg-background min-h-[90px] w-full rounded-md border px-3 py-2 text-sm"
                                rows={6}
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                placeholder="Write your announcement here..."
                            />
                        </FormField>
                    </FormSection>

                    <FormActions>
                        <Button type="button" variant="outline" onClick={() => history.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Publish Announcement
                        </Button>
                    </FormActions>
                </form>
            </div>
        </>
    );
}

AnnouncementsCreate.layout = (page: React.ReactNode) => <AppLayout children={page} />;
