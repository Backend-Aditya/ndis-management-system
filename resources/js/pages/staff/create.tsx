import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';

export default function StaffCreate() {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '', last_name: '', email: '', password: '',
        password_confirmation: '', role: 'staff_worker', phone: '',
        position: '', department: '', employment_type: 'casual',
        employment_start: '', hourly_rate: '', employee_number: '',
    });

    return (
        <>
            <Head title="Add Staff Member" />
            <div className="max-w-2xl p-6 space-y-6">
                <h1 className="text-2xl font-semibold">Add Staff Member</h1>
                <form onSubmit={(e) => { e.preventDefault(); post('/staff'); }} className="space-y-4">
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
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                            <InputError message={errors.password} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">Confirm Password</Label>
                            <Input id="password_confirmation" type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
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
                            <Label htmlFor="employee_number">Employee #</Label>
                            <Input id="employee_number" value={data.employee_number} onChange={(e) => setData('employee_number', e.target.value)} />
                            <InputError message={errors.employee_number} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="position">Position</Label>
                            <Input id="position" value={data.position} onChange={(e) => setData('position', e.target.value)} />
                            <InputError message={errors.position} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Input id="department" value={data.department} onChange={(e) => setData('department', e.target.value)} />
                            <InputError message={errors.department} />
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
                            <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
                            <Input id="hourly_rate" type="number" step="0.01" value={data.hourly_rate} onChange={(e) => setData('hourly_rate', e.target.value)} />
                            <InputError message={errors.hourly_rate} />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>Add Staff Member</Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>Cancel</Button>
                    </div>
                </form>
            </div>
        </>
    );
}
StaffCreate.layout = (page: React.ReactNode) => <AppLayout children={page} />;
