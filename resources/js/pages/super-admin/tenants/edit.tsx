import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormSection } from '@/components/form/form-section';
import { FormField } from '@/components/form/form-field';
import { FormActions } from '@/components/form/form-actions';
import type { Tenant } from '@/types/models';

interface Director {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
}

export default function TenantsEdit({ tenant, director }: { tenant: Tenant; director: Director | null }) {
    const { data, setData, put, processing, errors } = useForm({
        name: tenant.name,
        contact_email: tenant.contact_email,
        contact_phone: tenant.contact_phone ?? '',
        plan: tenant.plan,
        status: tenant.status,
        abn: tenant.abn ?? '',
        ndis_provider_number: tenant.ndis_provider_number ?? '',
        director_first_name: director?.first_name ?? '',
        director_last_name: director?.last_name ?? '',
        director_email: director?.email ?? '',
        director_password: '',
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

                    <FormSection
                        title="Director Login"
                        description={
                            director
                                ? "Credentials the organisation's director uses to sign in."
                                : 'This organisation has no director yet. Fill these in to create one.'
                        }
                    >
                        <FormField label="First Name" htmlFor="director_first_name" error={errors.director_first_name} required>
                            <Input
                                id="director_first_name"
                                value={data.director_first_name}
                                onChange={(e) => setData('director_first_name', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Last Name" htmlFor="director_last_name" error={errors.director_last_name} required>
                            <Input
                                id="director_last_name"
                                value={data.director_last_name}
                                onChange={(e) => setData('director_last_name', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Email" htmlFor="director_email" error={errors.director_email} required full>
                            <Input
                                id="director_email"
                                type="email"
                                value={data.director_email}
                                onChange={(e) => setData('director_email', e.target.value)}
                            />
                        </FormField>
                        <FormField
                            label="Password"
                            htmlFor="director_password"
                            error={errors.director_password}
                            required={!director}
                            full
                            hint={
                                director
                                    ? 'Leave blank to keep the current password.'
                                    : 'Required to create the director account.'
                            }
                        >
                            <Input
                                id="director_password"
                                type="password"
                                value={data.director_password}
                                onChange={(e) => setData('director_password', e.target.value)}
                                placeholder="••••••••"
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
