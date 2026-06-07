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
import type { StaffProfile, User } from '@/types/models';

interface StaffWithProfile extends User {
    staff_profile: StaffProfile | null;
}

export default function StaffEdit({ staff }: { staff: StaffWithProfile }) {
    const { data, setData, put, processing, errors } = useForm({
        first_name: staff.first_name,
        last_name: staff.last_name,
        email: staff.email,
        phone: staff.phone ?? '',
        role: staff.roles[0] ?? 'staff_worker',
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
            <div className="max-w-3xl space-y-6 p-6">
                <h1 className="text-2xl font-semibold">Edit Staff Member</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        put(`/staff/${staff.id}`);
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
                        <FormField label="Email" htmlFor="email" error={errors.email} required>
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
                        <div className="flex items-center gap-2 sm:col-span-2">
                            <Checkbox
                                id="is_active"
                                checked={data.is_active}
                                onCheckedChange={(v) => setData('is_active', Boolean(v))}
                            />
                            <Label htmlFor="is_active">Active</Label>
                        </div>
                    </FormSection>

                    <FormSection title="Employment">
                        <FormField label="Position" htmlFor="position" error={errors.position}>
                            <Input
                                id="position"
                                value={data.position}
                                onChange={(e) => setData('position', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Employment Type" error={errors.employment_type}>
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
                            Save Changes
                        </Button>
                    </FormActions>
                </form>
            </div>
        </>
    );
}

StaffEdit.layout = (page: React.ReactNode) => <AppLayout children={page} />;
