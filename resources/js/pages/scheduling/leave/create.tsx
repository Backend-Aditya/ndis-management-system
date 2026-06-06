import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
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
                    {/* Staff & Type */}
                    <div className="space-y-4">
                        <h2 className="text-base font-medium text-muted-foreground">Leave Details</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Staff Member *</Label>
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
                                <InputError message={errors.staff_id} />
                            </div>
                            <div className="space-y-2">
                                <Label>Leave Type *</Label>
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
                                <InputError message={errors.leave_type} />
                            </div>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="space-y-4">
                        <h2 className="text-base font-medium text-muted-foreground">Dates</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="start_date">Start Date *</Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                />
                                <InputError message={errors.start_date} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="end_date">End Date *</Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                />
                                <InputError message={errors.end_date} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hours">Hours</Label>
                                <Input
                                    id="hours"
                                    type="number"
                                    step="0.5"
                                    value={data.hours}
                                    onChange={(e) => setData('hours', e.target.value)}
                                />
                                <InputError message={errors.hours} />
                            </div>
                        </div>
                    </div>

                    {/* Reason */}
                    <div className="space-y-4">
                        <h2 className="text-base font-medium text-muted-foreground">Reason</h2>
                        <div className="space-y-2">
                            <Label htmlFor="reason">Reason</Label>
                            <textarea
                                id="reason"
                                className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                                rows={3}
                                value={data.reason}
                                onChange={(e) => setData('reason', e.target.value)}
                            />
                            <InputError message={errors.reason} />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>
                            Submit Request
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

LeaveCreate.layout = (page: React.ReactNode) => <AppLayout children={page} />;
