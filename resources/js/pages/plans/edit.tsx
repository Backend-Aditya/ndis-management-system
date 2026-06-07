import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormSection } from '@/components/form/form-section';
import { FormField } from '@/components/form/form-field';
import { FormActions } from '@/components/form/form-actions';
import type { NdisPlan } from '@/types/models';

export default function PlansEdit({ plan }: { plan: NdisPlan }) {
    const { data, setData, put, processing, errors } = useForm({
        plan_number: plan.plan_number ?? '',
        plan_start_date: plan.plan_start_date ?? '',
        plan_end_date: plan.plan_end_date ?? '',
        management_type: plan.management_type,
        status: plan.status,
        core_total: plan.core_total ?? '',
        capacity_total: plan.capacity_total ?? '',
        capital_total: plan.capital_total ?? '',
        total_funding: plan.total_funding ?? '',
        ndia_contact_name: plan.ndia_contact_name ?? '',
        ndia_contact_phone: plan.ndia_contact_phone ?? '',
    });

    return (
        <>
            <Head title="Edit Plan" />
            <div className="max-w-3xl space-y-6 p-6">
                <h1 className="text-2xl font-semibold">Edit NDIS Plan</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        put(`/plans/${plan.id}`);
                    }}
                    className="space-y-6"
                >
                    <FormSection title="Plan">
                        <FormField label="Plan Number" htmlFor="plan_number" error={errors.plan_number}>
                            <Input
                                id="plan_number"
                                value={data.plan_number}
                                onChange={(e) => setData('plan_number', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Status" error={errors.status} required>
                            <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="expired">Expired</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>
                        <FormField label="Plan Start Date" htmlFor="plan_start_date" error={errors.plan_start_date}>
                            <Input
                                id="plan_start_date"
                                type="date"
                                value={data.plan_start_date}
                                onChange={(e) => setData('plan_start_date', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Plan End Date" htmlFor="plan_end_date" error={errors.plan_end_date}>
                            <Input
                                id="plan_end_date"
                                type="date"
                                value={data.plan_end_date}
                                onChange={(e) => setData('plan_end_date', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Management Type" error={errors.management_type} required>
                            <Select
                                value={data.management_type}
                                onValueChange={(v) => setData('management_type', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="agency_managed">Agency Managed</SelectItem>
                                    <SelectItem value="plan_managed">Plan Managed</SelectItem>
                                    <SelectItem value="self_managed">Self Managed</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>
                    </FormSection>

                    <FormSection title="Funding">
                        <FormField label="Core Total ($)" htmlFor="core_total" error={errors.core_total}>
                            <Input
                                id="core_total"
                                type="number"
                                step="0.01"
                                value={data.core_total}
                                onChange={(e) => setData('core_total', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Capacity Building Total ($)" htmlFor="capacity_total" error={errors.capacity_total}>
                            <Input
                                id="capacity_total"
                                type="number"
                                step="0.01"
                                value={data.capacity_total}
                                onChange={(e) => setData('capacity_total', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Capital Total ($)" htmlFor="capital_total" error={errors.capital_total}>
                            <Input
                                id="capital_total"
                                type="number"
                                step="0.01"
                                value={data.capital_total}
                                onChange={(e) => setData('capital_total', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Total Funding ($)" htmlFor="total_funding" error={errors.total_funding}>
                            <Input
                                id="total_funding"
                                type="number"
                                step="0.01"
                                value={data.total_funding}
                                onChange={(e) => setData('total_funding', e.target.value)}
                            />
                        </FormField>
                    </FormSection>

                    <FormSection title="NDIA Contact">
                        <FormField label="Contact Name" htmlFor="ndia_contact_name" error={errors.ndia_contact_name}>
                            <Input
                                id="ndia_contact_name"
                                value={data.ndia_contact_name}
                                onChange={(e) => setData('ndia_contact_name', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Contact Phone" htmlFor="ndia_contact_phone" error={errors.ndia_contact_phone}>
                            <Input
                                id="ndia_contact_phone"
                                value={data.ndia_contact_phone}
                                onChange={(e) => setData('ndia_contact_phone', e.target.value)}
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

PlansEdit.layout = (page: React.ReactNode) => <AppLayout children={page} />;
