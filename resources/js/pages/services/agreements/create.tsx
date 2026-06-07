import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormSection } from '@/components/form/form-section';
import { FormField } from '@/components/form/form-field';
import { FormActions } from '@/components/form/form-actions';
import type { NdisPlan, Participant, PaginatedResource } from '@/types/models';

export default function AgreementsCreate({
    participants,
    plans,
}: {
    participants: PaginatedResource<Participant>;
    plans: PaginatedResource<NdisPlan>;
}) {
    const { data, setData, post, processing, errors } = useForm({
        participant_id: '',
        plan_id: '',
        agreement_start: '',
        agreement_end: '',
        status: 'draft',
    });

    return (
        <>
            <Head title="Add Service Agreement" />
            <div className="max-w-3xl space-y-6 p-6">
                <h1 className="text-2xl font-semibold">Add Service Agreement</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/service-agreements');
                    }}
                    className="space-y-6"
                >
                    <FormSection title="Agreement">
                        <FormField label="Participant" error={errors.participant_id} required>
                            <Select
                                value={data.participant_id}
                                onValueChange={(v) => setData('participant_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select participant" />
                                </SelectTrigger>
                                <SelectContent>
                                    {participants.data.map((p) => (
                                        <SelectItem key={p.id} value={p.id}>
                                            {p.full_name} — {p.ndis_number}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormField>
                        <FormField label="Plan" error={errors.plan_id} required>
                            <Select value={data.plan_id} onValueChange={(v) => setData('plan_id', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select plan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {plans.data.map((plan) => (
                                        <SelectItem key={plan.id} value={plan.id}>
                                            {plan.plan_number ?? `Plan ${plan.id.slice(0, 8)}`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormField>
                        <FormField label="Agreement Start" htmlFor="agreement_start" error={errors.agreement_start}>
                            <Input
                                id="agreement_start"
                                type="date"
                                value={data.agreement_start}
                                onChange={(e) => setData('agreement_start', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Agreement End" htmlFor="agreement_end" error={errors.agreement_end}>
                            <Input
                                id="agreement_end"
                                type="date"
                                value={data.agreement_end}
                                onChange={(e) => setData('agreement_end', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Status" error={errors.status} required>
                            <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="expired">Expired</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>
                    </FormSection>

                    <FormActions>
                        <Button type="button" variant="outline" onClick={() => history.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Add Agreement
                        </Button>
                    </FormActions>
                </form>
            </div>
        </>
    );
}

AgreementsCreate.layout = (page: React.ReactNode) => <AppLayout children={page} />;
