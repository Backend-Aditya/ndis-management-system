import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormSection } from '@/components/form/form-section';
import { FormField } from '@/components/form/form-field';
import { FormActions } from '@/components/form/form-actions';

export default function ServiceTypesCreate() {
    const { data, setData, post, processing, errors } = useForm({
        ndis_support_item_number: '',
        name: '',
        support_category: '',
        unit_of_measure: '',
        standard_rate: '',
        weeknight_rate: '',
        saturday_rate: '',
        sunday_rate: '',
        public_holiday_rate: '',
        is_active: true,
    });

    return (
        <>
            <Head title="Add Service Type" />
            <div className="max-w-3xl space-y-6 p-6">
                <h1 className="text-2xl font-semibold">Add Service Type</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/service-types');
                    }}
                    className="space-y-6"
                >
                    <FormSection title="Service">
                        <FormField label="Name" htmlFor="name" error={errors.name} required full>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                        </FormField>
                        <FormField label="NDIS Support Item Number" htmlFor="ndis_support_item_number" error={errors.ndis_support_item_number}>
                            <Input
                                id="ndis_support_item_number"
                                value={data.ndis_support_item_number}
                                onChange={(e) => setData('ndis_support_item_number', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Support Category" htmlFor="support_category" error={errors.support_category}>
                            <Input
                                id="support_category"
                                value={data.support_category}
                                onChange={(e) => setData('support_category', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Unit of Measure" htmlFor="unit_of_measure" error={errors.unit_of_measure}>
                            <Input
                                id="unit_of_measure"
                                value={data.unit_of_measure}
                                onChange={(e) => setData('unit_of_measure', e.target.value)}
                                placeholder="e.g. H, EA"
                            />
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

                    <FormSection title="Rates">
                        <FormField label="Standard Rate ($)" htmlFor="standard_rate" error={errors.standard_rate} required>
                            <Input
                                id="standard_rate"
                                type="number"
                                step="0.01"
                                value={data.standard_rate}
                                onChange={(e) => setData('standard_rate', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Weeknight Rate ($)" htmlFor="weeknight_rate" error={errors.weeknight_rate}>
                            <Input
                                id="weeknight_rate"
                                type="number"
                                step="0.01"
                                value={data.weeknight_rate}
                                onChange={(e) => setData('weeknight_rate', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Saturday Rate ($)" htmlFor="saturday_rate" error={errors.saturday_rate}>
                            <Input
                                id="saturday_rate"
                                type="number"
                                step="0.01"
                                value={data.saturday_rate}
                                onChange={(e) => setData('saturday_rate', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Sunday Rate ($)" htmlFor="sunday_rate" error={errors.sunday_rate}>
                            <Input
                                id="sunday_rate"
                                type="number"
                                step="0.01"
                                value={data.sunday_rate}
                                onChange={(e) => setData('sunday_rate', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Public Holiday Rate ($)" htmlFor="public_holiday_rate" error={errors.public_holiday_rate}>
                            <Input
                                id="public_holiday_rate"
                                type="number"
                                step="0.01"
                                value={data.public_holiday_rate}
                                onChange={(e) => setData('public_holiday_rate', e.target.value)}
                            />
                        </FormField>
                    </FormSection>

                    <FormActions>
                        <Button type="button" variant="outline" onClick={() => history.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Add Service Type
                        </Button>
                    </FormActions>
                </form>
            </div>
        </>
    );
}

ServiceTypesCreate.layout = (page: React.ReactNode) => <AppLayout children={page} />;
