import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
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
                    {/* Assignment */}
                    <div className="space-y-4">
                        <h2 className="text-base font-medium text-muted-foreground">Assignment</h2>
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
                                <Label>Staff *</Label>
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
                                <InputError message={errors.staff_id} />
                            </div>
                            <div className="space-y-2">
                                <Label>Service Type *</Label>
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
                                <InputError message={errors.service_type_id} />
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
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
                                <InputError message={errors.status} />
                            </div>
                        </div>
                    </div>

                    {/* Schedule */}
                    <div className="space-y-4">
                        <h2 className="text-base font-medium text-muted-foreground">Schedule</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="scheduled_start">Scheduled Start *</Label>
                                <Input
                                    id="scheduled_start"
                                    type="datetime-local"
                                    value={data.scheduled_start}
                                    onChange={(e) => setData('scheduled_start', e.target.value)}
                                />
                                <InputError message={errors.scheduled_start} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="scheduled_end">Scheduled End *</Label>
                                <Input
                                    id="scheduled_end"
                                    type="datetime-local"
                                    value={data.scheduled_end}
                                    onChange={(e) => setData('scheduled_end', e.target.value)}
                                />
                                <InputError message={errors.scheduled_end} />
                            </div>
                        </div>
                    </div>

                    {/* Location & Transport */}
                    <div className="space-y-4">
                        <h2 className="text-base font-medium text-muted-foreground">Location & Transport</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                />
                                <InputError message={errors.location} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="kms_travelled">KMs Travelled</Label>
                                <Input
                                    id="kms_travelled"
                                    type="number"
                                    step="0.01"
                                    value={data.kms_travelled}
                                    onChange={(e) => setData('kms_travelled', e.target.value)}
                                />
                                <InputError message={errors.kms_travelled} />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="requires_transport"
                                checked={data.requires_transport}
                                onCheckedChange={(v) => setData('requires_transport', Boolean(v))}
                            />
                            <Label htmlFor="requires_transport">Requires transport</Label>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-4">
                        <h2 className="text-base font-medium text-muted-foreground">Notes</h2>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <textarea
                                id="notes"
                                className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                                rows={3}
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                            />
                            <InputError message={errors.notes} />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>
                            Schedule Shift
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

ShiftsCreate.layout = (page: React.ReactNode) => <AppLayout children={page} />;
