import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import type { ServiceType } from '@/types/models';

export default function ServiceTypesEdit({ serviceType }: { serviceType: ServiceType }) {
    const { data, setData, put, processing, errors } = useForm({
        ndis_support_item_number: serviceType.ndis_support_item_number ?? '',
        name: serviceType.name,
        support_category: serviceType.support_category ?? '',
        unit_of_measure: serviceType.unit_of_measure ?? '',
        standard_rate: serviceType.standard_rate,
        weeknight_rate: serviceType.weeknight_rate ?? '',
        saturday_rate: serviceType.saturday_rate ?? '',
        sunday_rate: serviceType.sunday_rate ?? '',
        public_holiday_rate: serviceType.public_holiday_rate ?? '',
        is_active: serviceType.is_active,
    });

    return (
        <>
            <Head title="Edit Service Type" />
            <div className="max-w-3xl space-y-6 p-6">
                <h1 className="text-2xl font-semibold">Edit Service Type</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        put(`/service-types/${serviceType.id}`);
                    }}
                    className="space-y-6"
                >
                    {/* Basic Details */}
                    <div className="space-y-4">
                        <h2 className="text-base font-medium text-muted-foreground">Service Details</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="ndis_support_item_number">NDIS Support Item Number</Label>
                                <Input
                                    id="ndis_support_item_number"
                                    value={data.ndis_support_item_number}
                                    onChange={(e) => setData('ndis_support_item_number', e.target.value)}
                                />
                                <InputError message={errors.ndis_support_item_number} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Name *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                <InputError message={errors.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="support_category">Support Category</Label>
                                <Input
                                    id="support_category"
                                    value={data.support_category}
                                    onChange={(e) => setData('support_category', e.target.value)}
                                />
                                <InputError message={errors.support_category} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="unit_of_measure">Unit of Measure</Label>
                                <Input
                                    id="unit_of_measure"
                                    value={data.unit_of_measure}
                                    onChange={(e) => setData('unit_of_measure', e.target.value)}
                                    placeholder="e.g. H, EA"
                                />
                                <InputError message={errors.unit_of_measure} />
                            </div>
                        </div>
                    </div>

                    {/* Rates */}
                    <div className="space-y-4">
                        <h2 className="text-base font-medium text-muted-foreground">Rates</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="standard_rate">Standard Rate ($) *</Label>
                                <Input
                                    id="standard_rate"
                                    type="number"
                                    step="0.01"
                                    value={data.standard_rate}
                                    onChange={(e) => setData('standard_rate', e.target.value)}
                                />
                                <InputError message={errors.standard_rate} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="weeknight_rate">Weeknight Rate ($)</Label>
                                <Input
                                    id="weeknight_rate"
                                    type="number"
                                    step="0.01"
                                    value={data.weeknight_rate}
                                    onChange={(e) => setData('weeknight_rate', e.target.value)}
                                />
                                <InputError message={errors.weeknight_rate} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="saturday_rate">Saturday Rate ($)</Label>
                                <Input
                                    id="saturday_rate"
                                    type="number"
                                    step="0.01"
                                    value={data.saturday_rate}
                                    onChange={(e) => setData('saturday_rate', e.target.value)}
                                />
                                <InputError message={errors.saturday_rate} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sunday_rate">Sunday Rate ($)</Label>
                                <Input
                                    id="sunday_rate"
                                    type="number"
                                    step="0.01"
                                    value={data.sunday_rate}
                                    onChange={(e) => setData('sunday_rate', e.target.value)}
                                />
                                <InputError message={errors.sunday_rate} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="public_holiday_rate">Public Holiday Rate ($)</Label>
                                <Input
                                    id="public_holiday_rate"
                                    type="number"
                                    step="0.01"
                                    value={data.public_holiday_rate}
                                    onChange={(e) => setData('public_holiday_rate', e.target.value)}
                                />
                                <InputError message={errors.public_holiday_rate} />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="is_active"
                            checked={data.is_active}
                            onCheckedChange={(v) => setData('is_active', Boolean(v))}
                        />
                        <Label htmlFor="is_active">Active</Label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>
                            Save Changes
                        </Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

ServiceTypesEdit.layout = (page: React.ReactNode) => <AppLayout children={page} />;
