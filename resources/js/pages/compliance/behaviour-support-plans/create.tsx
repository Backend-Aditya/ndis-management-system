import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormSection } from '@/components/form/form-section';
import { FormField } from '@/components/form/form-field';
import { FormActions } from '@/components/form/form-actions';
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
                    <FormSection title="Plan">
                        <FormField label="Participant" error={errors.participant_id} required>
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
                        </FormField>
                        <FormField label="Status" error={errors.status}>
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
                        </FormField>
                        <FormField label="Plan Date" htmlFor="plan_date" error={errors.plan_date}>
                            <Input
                                id="plan_date"
                                type="date"
                                value={data.plan_date}
                                onChange={(e) => setData('plan_date', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Review Date" htmlFor="review_date" error={errors.review_date}>
                            <Input
                                id="review_date"
                                type="date"
                                value={data.review_date}
                                onChange={(e) => setData('review_date', e.target.value)}
                            />
                        </FormField>
                        <div className="flex items-center gap-2 sm:col-span-2">
                            <Checkbox
                                id="uses_restrictive_practices"
                                checked={data.uses_restrictive_practices}
                                onCheckedChange={(v) => setData('uses_restrictive_practices', Boolean(v))}
                            />
                            <Label htmlFor="uses_restrictive_practices">Uses restrictive practices</Label>
                        </div>
                        <FormField label="Restrictive Practice Type" htmlFor="restrictive_practice_type" error={errors.restrictive_practice_type}>
                            <Input
                                id="restrictive_practice_type"
                                value={data.restrictive_practice_type}
                                onChange={(e) => setData('restrictive_practice_type', e.target.value)}
                                placeholder="e.g. mechanical restraint"
                            />
                        </FormField>
                    </FormSection>

                    <FormSection title="Detail">
                        <FormField label="Triggers" htmlFor="triggers" error={errors.triggers} full>
                            <textarea
                                id="triggers"
                                className="border-input bg-background min-h-[90px] w-full rounded-md border px-3 py-2 text-sm"
                                value={data.triggers}
                                onChange={(e) => setData('triggers', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Strategies" htmlFor="strategies" error={errors.strategies} full>
                            <textarea
                                id="strategies"
                                className="border-input bg-background min-h-[90px] w-full rounded-md border px-3 py-2 text-sm"
                                value={data.strategies}
                                onChange={(e) => setData('strategies', e.target.value)}
                            />
                        </FormField>
                    </FormSection>

                    <FormActions>
                        <Button type="button" variant="outline" onClick={() => history.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Save Plan
                        </Button>
                    </FormActions>
                </form>
            </div>
        </>
    );
}

BehaviourSupportPlansCreate.layout = (page: React.ReactNode) => <AppLayout children={page} />;
