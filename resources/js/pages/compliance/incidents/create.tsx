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
                    {/* Basic Details */}
                    <div className="space-y-4">
                        <h2 className="text-base font-medium text-muted-foreground">Basic Details</h2>
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
                                <Label>Incident Type *</Label>
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
                                <InputError message={errors.incident_type} />
                            </div>
                            <div className="space-y-2">
                                <Label>Severity *</Label>
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
                                <InputError message={errors.severity} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="occurred_at">Occurred At</Label>
                                <Input
                                    id="occurred_at"
                                    type="datetime-local"
                                    value={data.occurred_at}
                                    onChange={(e) => setData('occurred_at', e.target.value)}
                                />
                                <InputError message={errors.occurred_at} />
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
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
                                <InputError message={errors.status} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ndis_reportable_type">NDIS Reportable Type</Label>
                                <Input
                                    id="ndis_reportable_type"
                                    value={data.ndis_reportable_type}
                                    onChange={(e) => setData('ndis_reportable_type', e.target.value)}
                                    placeholder="e.g. serious injury"
                                />
                                <InputError message={errors.ndis_reportable_type} />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-4">
                        <h2 className="text-base font-medium text-muted-foreground">Description</h2>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <textarea
                                id="description"
                                className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                                rows={4}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                            <InputError message={errors.description} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="immediate_actions">Immediate Actions Taken</Label>
                            <textarea
                                id="immediate_actions"
                                className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                                rows={3}
                                value={data.immediate_actions}
                                onChange={(e) => setData('immediate_actions', e.target.value)}
                            />
                            <InputError message={errors.immediate_actions} />
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="space-y-4">
                        <h2 className="text-base font-medium text-muted-foreground">Notifications</h2>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="notified_participant"
                                    checked={data.notified_participant}
                                    onCheckedChange={(v) => setData('notified_participant', Boolean(v))}
                                />
                                <Label htmlFor="notified_participant">Participant notified</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="notified_ndis_commission"
                                    checked={data.notified_ndis_commission}
                                    onCheckedChange={(v) => setData('notified_ndis_commission', Boolean(v))}
                                />
                                <Label htmlFor="notified_ndis_commission">NDIS Commission notified</Label>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>
                            Report Incident
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

IncidentsCreate.layout = (page: React.ReactNode) => <AppLayout children={page} />;
