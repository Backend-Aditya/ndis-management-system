import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormSection } from '@/components/form/form-section';
import { FormField } from '@/components/form/form-field';
import { FormActions } from '@/components/form/form-actions';
import type { Tenant } from '@/types/models';

export default function TenantsEdit({ tenant }: { tenant: Tenant }) {
    const { data, setData, put, processing, errors } = useForm({
        name: tenant.name,
        contact_email: tenant.contact_email,
        contact_phone: tenant.contact_phone ?? '',
        plan: tenant.plan,
        status: tenant.status,
        abn: tenant.abn ?? '',
        ndis_provider_number: tenant.ndis_provider_number ?? '',
    });

    return (
        <>
            <Head title={`Edit ${tenant.name}`} />
            <div className="max-w-3xl space-y-6 p-6">
                <h1 className="text-2xl font-semibold">Edit Organisation</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        put(`/super-admin/tenants/${tenant.id}`);
                    }}
                    className="space-y-6"
                >
                    <FormSection title="Organisation Details">
                        <FormField label="Organisation Name" htmlFor="name" error={errors.name} required full>
                            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        </FormField>
                        <FormField label="Contact Email" htmlFor="contact_email" error={errors.contact_email} required>
                            <Input
                                id="contact_email"
                                type="email"
                                value={data.contact_email}
                                onChange={(e) => setData('contact_email', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Contact Phone" htmlFor="contact_phone" error={errors.contact_phone}>
                            <Input
                                id="contact_phone"
                                value={data.contact_phone}
                                onChange={(e) => setData('contact_phone', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Plan" error={errors.plan} required>
                            <Select value={data.plan} onValueChange={(v) => setData('plan', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="starter">Starter</SelectItem>
                                    <SelectItem value="professional">Professional</SelectItem>
                                    <SelectItem value="enterprise">Enterprise</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>
                        <FormField label="Status" error={errors.status} required>
                            <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="trialing">Trialing</SelectItem>
                                    <SelectItem value="suspended">Suspended</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>
                        <FormField label="ABN" htmlFor="abn" error={errors.abn}>
                            <Input id="abn" value={data.abn} onChange={(e) => setData('abn', e.target.value)} />
                        </FormField>
                        <FormField label="NDIS Provider Number" htmlFor="ndis_provider_number" error={errors.ndis_provider_number}>
                            <Input
                                id="ndis_provider_number"
                                value={data.ndis_provider_number}
                                onChange={(e) => setData('ndis_provider_number', e.target.value)}
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

TenantsEdit.layout = (page: React.ReactNode) => <AppLayout children={page} />;
