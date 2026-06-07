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
import type { Participant, User, ServiceType } from '@/types/models';

interface Props {
    participants: { data: Participant[] };
    staff: { data: User[] };
    serviceTypes: { data: ServiceType[] };
}

export default function ShiftsCreate({ participants, staff, serviceTypes }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        participant_id: '',
        staff_id: '',
        service_type_id: '',
        scheduled_start: '',
        scheduled_end: '',
        status: 'scheduled',
        location: '',
        requires_transport: false,
        kms_travelled: '',
        notes: '',
    });

    return (
        <>
            <Head title="Schedule Shift" />
            <div className="max-w-3xl space-y-6 p-6">
                <h1 className="text-2xl font-semibold">Schedule Shift</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/shifts');
                    }}
                    className="space-y-6"
                >
                    <FormSection title="Shift">
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
                        <FormField label="Staff" error={errors.staff_id} required>
                            <Select value={data.staff_id} onValueChange={(v) => setData('staff_id', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select staff" />
                                </SelectTrigger>
                                <SelectContent>
                                    {staff.data.map((s) => (
                                        <SelectItem key={s.id} value={s.id}>
                                            {s.full_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormField>
                        <FormField label="Service Type" error={errors.service_type_id} required>
                            <Select value={data.service_type_id} onValueChange={(v) => setData('service_type_id', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select service type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {serviceTypes.data.map((st) => (
                                        <SelectItem key={st.id} value={st.id}>
                                            {st.name}
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
                                    <SelectItem value="scheduled">Scheduled</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>
                        <FormField label="Scheduled Start" htmlFor="scheduled_start" error={errors.scheduled_start} required>
                            <Input
                                id="scheduled_start"
                                type="datetime-local"
                                value={data.scheduled_start}
                                onChange={(e) => setData('scheduled_start', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Scheduled End" htmlFor="scheduled_end" error={errors.scheduled_end} required>
                            <Input
                                id="scheduled_end"
                                type="datetime-local"
                                value={data.scheduled_end}
                                onChange={(e) => setData('scheduled_end', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Location" htmlFor="location" error={errors.location} full>
                            <Input
                                id="location"
                                value={data.location}
                                onChange={(e) => setData('location', e.target.value)}
                            />
                        </FormField>
                    </FormSection>

                    <FormSection title="Transport & Notes">
                        <div className="flex items-center gap-2 sm:col-span-2">
                            <Checkbox
                                id="requires_transport"
                                checked={data.requires_transport}
                                onCheckedChange={(v) => setData('requires_transport', Boolean(v))}
                            />
                            <Label htmlFor="requires_transport">Requires transport</Label>
                        </div>
                        <FormField label="KMs Travelled" htmlFor="kms_travelled" error={errors.kms_travelled}>
                            <Input
                                id="kms_travelled"
                                type="number"
                                step="0.01"
                                value={data.kms_travelled}
                                onChange={(e) => setData('kms_travelled', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Notes" htmlFor="notes" error={errors.notes} full>
                            <textarea
                                id="notes"
                                className="border-input bg-background min-h-[90px] w-full rounded-md border px-3 py-2 text-sm"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                            />
                        </FormField>
                    </FormSection>

                    <FormActions>
                        <Button type="button" variant="outline" onClick={() => history.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Schedule Shift
                        </Button>
                    </FormActions>
                </form>
            </div>
        </>
    );
}

ShiftsCreate.layout = (page: React.ReactNode) => <AppLayout children={page} />;
