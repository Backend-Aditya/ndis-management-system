import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import SuperAdminLayout from '@/layouts/super-admin-layout';
import type { Tenant } from '@/types/models';

export default function TenantsEdit({ tenant }: { tenant: Tenant }) {
    const { data, setData, put, processing, errors } = useForm({
        name: tenant.name, contact_email: tenant.contact_email, plan: tenant.plan,
        status: tenant.status, abn: tenant.abn ?? '', ndis_provider_number: tenant.ndis_provider_number ?? '',
        contact_phone: tenant.contact_phone ?? '',
    });

    return (
        <>
            <Head title={`Edit ${tenant.name}`} />
            <div className="max-w-2xl space-y-6">
                <h1 className="text-2xl font-semibold">Edit Tenant</h1>
                <form onSubmit={(e) => { e.preventDefault(); put(`/super-admin/tenants/${tenant.id}`); }} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Organisation Name</Label>
                            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            <InputError message={errors.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact_email">Contact Email</Label>
                            <Input id="contact_email" type="email" value={data.contact_email} onChange={(e) => setData('contact_email', e.target.value)} />
                            <InputError message={errors.contact_email} />
                        </div>
                        <div className="space-y-2">
                            <Label>Plan</Label>
                            <Select value={data.plan} onValueChange={(v) => setData('plan', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="starter">Starter</SelectItem>
                                    <SelectItem value="professional">Professional</SelectItem>
                                    <SelectItem value="enterprise">Enterprise</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.plan} />
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="trialing">Trialing</SelectItem>
                                    <SelectItem value="suspended">Suspended</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.status} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="abn">ABN</Label>
                            <Input id="abn" value={data.abn} onChange={(e) => setData('abn', e.target.value)} />
                            <InputError message={errors.abn} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ndis_provider_number">NDIS Provider Number</Label>
                            <Input id="ndis_provider_number" value={data.ndis_provider_number} onChange={(e) => setData('ndis_provider_number', e.target.value)} />
                            <InputError message={errors.ndis_provider_number} />
                        </div>
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
TenantsEdit.layout = (page: React.ReactNode) => <SuperAdminLayout>{page}</SuperAdminLayout>;
