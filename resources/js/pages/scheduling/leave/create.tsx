import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormSection } from '@/components/form/form-section';
import { FormField } from '@/components/form/form-field';
import { FormActions } from '@/components/form/form-actions';
import type { User } from '@/types/models';

interface Props {
    staff: { data: User[] };
}

export default function LeaveCreate({ staff }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        staff_id: '',
        leave_type: 'annual',
        start_date: '',
        end_date: '',
        hours: '',
        reason: '',
    });

    return (
        <>
            <Head title="Request Leave" />
            <div className="max-w-3xl space-y-6 p-6">
                <h1 className="text-2xl font-semibold">Request Leave</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/leave');
                    }}
                    className="space-y-6"
                >
                    <FormSection title="Leave Request">
                        <FormField label="Staff Member" error={errors.staff_id} required>
                            <Select value={data.staff_id} onValueChange={(v) => setData('staff_id', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select staff member" />
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
                        <FormField label="Leave Type" error={errors.leave_type} required>
                            <Select value={data.leave_type} onValueChange={(v) => setData('leave_type', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="annual">Annual</SelectItem>
                                    <SelectItem value="sick">Sick</SelectItem>
                                    <SelectItem value="personal">Personal</SelectItem>
                                    <SelectItem value="unpaid">Unpaid</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>
                        <FormField label="Start Date" htmlFor="start_date" error={errors.start_date} required>
                            <Input
                                id="start_date"
                                type="date"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                            />
                        </FormField>
                        <FormField label="End Date" htmlFor="end_date" error={errors.end_date} required>
                            <Input
                                id="end_date"
                                type="date"
                                value={data.end_date}
                                onChange={(e) => setData('end_date', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Hours" htmlFor="hours" error={errors.hours}>
                            <Input
                                id="hours"
                                type="number"
                                step="0.5"
                                value={data.hours}
                                onChange={(e) => setData('hours', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Reason" htmlFor="reason" error={errors.reason} full>
                            <textarea
                                id="reason"
                                className="border-input bg-background min-h-[90px] w-full rounded-md border px-3 py-2 text-sm"
                                value={data.reason}
                                onChange={(e) => setData('reason', e.target.value)}
                            />
                        </FormField>
                    </FormSection>

                    <FormActions>
                        <Button type="button" variant="outline" onClick={() => history.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Submit Request
                        </Button>
                    </FormActions>
                </form>
            </div>
        </>
    );
}

LeaveCreate.layout = (page: React.ReactNode) => <AppLayout children={page} />;
