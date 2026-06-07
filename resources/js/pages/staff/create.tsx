import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormSection } from '@/components/form/form-section';
import { FormField } from '@/components/form/form-field';
import { FormActions } from '@/components/form/form-actions';

export default function StaffCreate() {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        role: 'staff_worker',
        employee_number: '',
        position: '',
        department: '',
        employment_type: 'casual',
        employment_start: '',
        hourly_rate: '',
    });

    return (
        <>
            <Head title="Add Staff Member" />
            <div className="max-w-3xl space-y-6 p-6">
                <h1 className="text-2xl font-semibold">Add Staff Member</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/staff');
                    }}
                    className="space-y-6"
                >
                    <FormSection title="Account">
                        <FormField label="First Name" htmlFor="first_name" error={errors.first_name} required>
                            <Input
                                id="first_name"
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Last Name" htmlFor="last_name" error={errors.last_name} required>
                            <Input
                                id="last_name"
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Email" htmlFor="email" error={errors.email} required full>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Phone" htmlFor="phone" error={errors.phone}>
                            <Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                        </FormField>
                        <FormField label="Password" htmlFor="password" error={errors.password} required>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Confirm Password" htmlFor="password_confirmation" error={errors.password_confirmation}>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                            />
                        </FormField>
                    </FormSection>

                    <FormSection title="Employment">
                        <FormField label="Role" error={errors.role} required>
                            <Select value={data.role} onValueChange={(v) => setData('role', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="manager">Manager</SelectItem>
                                    <SelectItem value="staff_worker">Staff Worker</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>
                        <FormField label="Employee #" htmlFor="employee_number" error={errors.employee_number}>
                            <Input
                                id="employee_number"
                                value={data.employee_number}
                                onChange={(e) => setData('employee_number', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Position" htmlFor="position" error={errors.position}>
                            <Input
                                id="position"
                                value={data.position}
                                onChange={(e) => setData('position', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Department" htmlFor="department" error={errors.department}>
                            <Input
                                id="department"
                                value={data.department}
                                onChange={(e) => setData('department', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Employment Type" error={errors.employment_type} required>
                            <Select value={data.employment_type} onValueChange={(v) => setData('employment_type', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="full_time">Full Time</SelectItem>
                                    <SelectItem value="part_time">Part Time</SelectItem>
                                    <SelectItem value="casual">Casual</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>
                        <FormField label="Employment Start" htmlFor="employment_start" error={errors.employment_start}>
                            <Input
                                id="employment_start"
                                type="date"
                                value={data.employment_start}
                                onChange={(e) => setData('employment_start', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Hourly Rate ($)" htmlFor="hourly_rate" error={errors.hourly_rate}>
                            <Input
                                id="hourly_rate"
                                type="number"
                                step="0.01"
                                value={data.hourly_rate}
                                onChange={(e) => setData('hourly_rate', e.target.value)}
                            />
                        </FormField>
                    </FormSection>

                    <FormActions>
                        <Button type="button" variant="outline" onClick={() => history.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Add Staff Member
                        </Button>
                    </FormActions>
                </form>
            </div>
        </>
    );
}

StaffCreate.layout = (page: React.ReactNode) => <AppLayout children={page} />;
