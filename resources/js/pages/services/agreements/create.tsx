import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
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
                    <div className="space-y-4">
                        <h2 className="text-base font-medium text-muted-foreground">Agreement Details</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Participant *</Label>
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
                                <InputError message={errors.participant_id} />
                            </div>
                            <div className="space-y-2">
                                <Label>Plan *</Label>
                                <Select
                                    value={data.plan_id}
                                    onValueChange={(v) => setData('plan_id', v)}
                                >
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
                                <InputError message={errors.plan_id} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="agreement_start">Agreement Start</Label>
                                <Input
                                    id="agreement_start"
                                    type="date"
                                    value={data.agreement_start}
                                    onChange={(e) => setData('agreement_start', e.target.value)}
                                />
                                <InputError message={errors.agreement_start} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="agreement_end">Agreement End</Label>
                                <Input
                                    id="agreement_end"
                                    type="date"
                                    value={data.agreement_end}
                                    onChange={(e) => setData('agreement_end', e.target.value)}
                                />
                                <InputError message={errors.agreement_end} />
                            </div>
                            <div className="space-y-2">
                                <Label>Status *</Label>
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
                                <InputError message={errors.status} />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>
                            Add Agreement
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

AgreementsCreate.layout = (page: React.ReactNode) => <AppLayout children={page} />;
