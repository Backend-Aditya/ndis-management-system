import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormSection } from '@/components/form/form-section';
import { FormField } from '@/components/form/form-field';
import { FormActions } from '@/components/form/form-actions';

export default function TenantsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        contact_email: '',
        contact_phone: '',
        plan: 'starter',
        status: 'active',
        abn: '',
        ndis_provider_number: '',
        director_first_name: '',
        director_last_name: '',
        director_email: '',
        director_password: '',
    });

    return (
        <>
            <Head title="Add Organisation" />
            <div className="max-w-3xl space-y-6 p-6">
                <h1 className="text-2xl font-semibold">Add Organisation</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/super-admin/tenants');
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
                        description="Credentials for the organisation's director account"
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
                        <FormField label="Password" htmlFor="director_password" error={errors.director_password} required full>
                            <Input
                                id="director_password"
                                type="password"
                                value={data.director_password}
                                onChange={(e) => setData('director_password', e.target.value)}
                            />
                        </FormField>
                    </FormSection>

                    <FormActions>
                        <Button type="button" variant="outline" onClick={() => history.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Create Organisation
                        </Button>
                    </FormActions>
                </form>
            </div>
        </>
    );
}

TenantsCreate.layout = (page: React.ReactNode) => <AppLayout children={page} />;
