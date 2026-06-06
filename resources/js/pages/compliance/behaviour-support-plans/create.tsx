import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import type { Participant } from '@/types/models';

interface Props {
    participants: { data: Participant[] };
}

export default function BehaviourSupportPlansCreate({ participants }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        participant_id: '',
        plan_date: '',
        review_date: '',
        triggers: '',
        strategies: '',
        uses_restrictive_practices: false,
        restrictive_practice_type: '',
        status: 'active',
    });

    return (
        <>
            <Head title="New Behaviour Support Plan" />
            <div className="max-w-3xl space-y-6 p-6">
                <h1 className="text-2xl font-semibold">New Behaviour Support Plan</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/behaviour-support-plans');
                    }}
                    className="space-y-6"
                >
                    {/* Plan Details */}
                    <div className="space-y-4">
                        <h2 className="text-base font-medium text-muted-foreground">Plan Details</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Participant *</Label>
                                <Select value={data.participant_id} onValueChange={(v) => setData('participant_id', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select participant" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {participants.data.map((p) => (
                                            <SelectItem key={p.id} value={p.id}>
                                                {p.full_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.participant_id} />
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="under_review">Under Review</SelectItem>
                                        <SelectItem value="expired">Expired</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.status} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="plan_date">Plan Date</Label>
                                <Input
                                    id="plan_date"
                                    type="date"
                                    value={data.plan_date}
                                    onChange={(e) => setData('plan_date', e.target.value)}
                                />
                                <InputError message={errors.plan_date} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="review_date">Review Date</Label>
                                <Input
                                    id="review_date"
                                    type="date"
                                    value={data.review_date}
                                    onChange={(e) => setData('review_date', e.target.value)}
                                />
                                <InputError message={errors.review_date} />
                            </div>
                        </div>
                    </div>

                    {/* Behaviour Details */}
                    <div className="space-y-4">
                        <h2 className="text-base font-medium text-muted-foreground">Behaviour Details</h2>
                        <div className="space-y-2">
                            <Label htmlFor="triggers">Triggers</Label>
                            <textarea
                                id="triggers"
                                className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                                rows={3}
                                value={data.triggers}
                                onChange={(e) => setData('triggers', e.target.value)}
                            />
                            <InputError message={errors.triggers} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="strategies">Strategies</Label>
                            <textarea
                                id="strategies"
                                className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                                rows={4}
                                value={data.strategies}
                                onChange={(e) => setData('strategies', e.target.value)}
                            />
                            <InputError message={errors.strategies} />
                        </div>
                    </div>

                    {/* Restrictive Practices */}
                    <div className="space-y-4">
                        <h2 className="text-base font-medium text-muted-foreground">Restrictive Practices</h2>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="uses_restrictive_practices"
                                checked={data.uses_restrictive_practices}
                                onCheckedChange={(v) => setData('uses_restrictive_practices', Boolean(v))}
                            />
                            <Label htmlFor="uses_restrictive_practices">Uses restrictive practices</Label>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="restrictive_practice_type">Restrictive Practice Type</Label>
                            <Input
                                id="restrictive_practice_type"
                                value={data.restrictive_practice_type}
                                onChange={(e) => setData('restrictive_practice_type', e.target.value)}
                                placeholder="e.g. mechanical restraint"
                            />
                            <InputError message={errors.restrictive_practice_type} />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>
                            Save Plan
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

BehaviourSupportPlansCreate.layout = (page: React.ReactNode) => <AppLayout children={page} />;
