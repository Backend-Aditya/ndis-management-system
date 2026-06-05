import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import type { StaffProfile, User } from '@/types/models';

interface StaffWithProfile extends User {
    staff_profile: StaffProfile | null;
}

export default function StaffEdit({ staff }: { staff: StaffWithProfile }) {
    const { data, setData, put, processing, errors } = useForm({
        first_name: staff.first_name, last_name: staff.last_name, email: staff.email,
        phone: staff.phone ?? '', role: staff.roles[0] ?? 'staff_worker',
        is_active: staff.is_active,
        position: staff.staff_profile?.position ?? '',
        department: staff.staff_profile?.department ?? '',
        employment_type: staff.staff_profile?.employment_type ?? 'casual',
        employment_start: staff.staff_profile?.employment_start ?? '',
        hourly_rate: staff.staff_profile?.hourly_rate ?? '',
        kms_rate: staff.staff_profile?.kms_rate ?? '',
    });

    return (
        <>
            <Head title={`Edit ${staff.full_name}`} />
            <div className="max-w-2xl p-6 space-y-6">
                <h1 className="text-2xl font-semibold">Edit Staff Member</h1>
                <form onSubmit={(e) => { e.preventDefault(); put(`/staff/${staff.id}`); }} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="first_name">First Name</Label>
                            <Input id="first_name" value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} />
                            <InputError message={errors.first_name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last_name">Last Name</Label>
                            <Input id="last_name" value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} />
                            <InputError message={errors.last_name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            <InputError message={errors.email} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                            <InputError message={errors.phone} />
                        </div>
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Select value={data.role} onValueChange={(v) => setData('role', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="manager">Manager</SelectItem>
                                    <SelectItem value="staff_worker">Staff Worker</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.role} />
                        </div>
                        <div className="space-y-2">
                            <Label>Employment Type</Label>
                            <Select value={data.employment_type} onValueChange={(v) => setData('employment_type', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="full_time">Full Time</SelectItem>
                                    <SelectItem value="part_time">Part Time</SelectItem>
                                    <SelectItem value="casual">Casual</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.employment_type} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="position">Position</Label>
                            <Input id="position" value={data.position} onChange={(e) => setData('position', e.target.value)} />
                            <InputError message={errors.position} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
                            <Input id="hourly_rate" type="number" step="0.01" value={data.hourly_rate} onChange={(e) => setData('hourly_rate', e.target.value)} />
                            <InputError message={errors.hourly_rate} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(v) => setData('is_active', Boolean(v))} />
                        <Label htmlFor="is_active">Active</Label>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>Save Changes</Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>Cancel</Button>
                    </div>
                </form>
            </div>
        </>
    );
}
StaffEdit.layout = (page: React.ReactNode) => <AppLayout children={page} />;
