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

export default function IncidentsCreate({ participants }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        participant_id: '',
        incident_type: '',
        severity: '',
        occurred_at: '',
        description: '',
        immediate_actions: '',
        notified_participant: false,
        notified_ndis_commission: false,
        ndis_reportable_type: '',
        status: 'open',
    });

    return (
        <>
            <Head title="Report Incident" />
            <div className="max-w-3xl space-y-6 p-6">
                <h1 className="text-2xl font-semibold">Report Incident</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/incidents');
                    }}
                    className="space-y-6"
                >
                    <FormSection title="Incident">
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
                        <FormField label="Incident Type" error={errors.incident_type} required>
                            <Select value={data.incident_type} onValueChange={(v) => setData('incident_type', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="injury">Injury</SelectItem>
                                    <SelectItem value="medication_error">Medication Error</SelectItem>
                                    <SelectItem value="behaviour">Behaviour</SelectItem>
                                    <SelectItem value="property_damage">Property Damage</SelectItem>
                                    <SelectItem value="abuse_neglect">Abuse / Neglect</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>
                        <FormField label="Severity" error={errors.severity} required>
                            <Select value={data.severity} onValueChange={(v) => setData('severity', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select severity" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>
                        <FormField label="Occurred At" htmlFor="occurred_at" error={errors.occurred_at}>
                            <Input
                                id="occurred_at"
                                type="datetime-local"
                                value={data.occurred_at}
                                onChange={(e) => setData('occurred_at', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Status" error={errors.status}>
                            <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="open">Open</SelectItem>
                                    <SelectItem value="investigating">Investigating</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>
                    </FormSection>

                    <FormSection title="Details">
                        <FormField label="Description" htmlFor="description" error={errors.description} required full>
                            <textarea
                                id="description"
                                className="border-input bg-background min-h-[90px] w-full rounded-md border px-3 py-2 text-sm"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Immediate Actions Taken" htmlFor="immediate_actions" error={errors.immediate_actions} full>
                            <textarea
                                id="immediate_actions"
                                className="border-input bg-background min-h-[90px] w-full rounded-md border px-3 py-2 text-sm"
                                value={data.immediate_actions}
                                onChange={(e) => setData('immediate_actions', e.target.value)}
                            />
                        </FormField>
                        <FormField label="NDIS Reportable Type" htmlFor="ndis_reportable_type" error={errors.ndis_reportable_type}>
                            <Input
                                id="ndis_reportable_type"
                                value={data.ndis_reportable_type}
                                onChange={(e) => setData('ndis_reportable_type', e.target.value)}
                                placeholder="e.g. serious injury"
                            />
                        </FormField>
                    </FormSection>

                    <FormSection title="Notifications">
                        <div className="flex items-center gap-2 sm:col-span-2">
                            <Checkbox
                                id="notified_participant"
                                checked={data.notified_participant}
                                onCheckedChange={(v) => setData('notified_participant', Boolean(v))}
                            />
                            <Label htmlFor="notified_participant">Participant notified</Label>
                        </div>
                        <div className="flex items-center gap-2 sm:col-span-2">
                            <Checkbox
                                id="notified_ndis_commission"
                                checked={data.notified_ndis_commission}
                                onCheckedChange={(v) => setData('notified_ndis_commission', Boolean(v))}
                            />
                            <Label htmlFor="notified_ndis_commission">NDIS Commission notified</Label>
                        </div>
                    </FormSection>

                    <FormActions>
                        <Button type="button" variant="outline" onClick={() => history.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Report Incident
                        </Button>
                    </FormActions>
                </form>
            </div>
        </>
    );
}

IncidentsCreate.layout = (page: React.ReactNode) => <AppLayout children={page} />;
