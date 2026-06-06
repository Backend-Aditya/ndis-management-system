import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
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
                    {/* Plan Details */}
                    <div className="space-y-4">
                        <h2 className="text-base font-medium text-muted-foreground">Plan Details</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="plan_number">Plan Number</Label>
                                <Input
                                    id="plan_number"
                                    value={data.plan_number}
                                    onChange={(e) => setData('plan_number', e.target.value)}
                                />
                                <InputError message={errors.plan_number} />
                            </div>
                            <div className="space-y-2">
                                <Label>Status *</Label>
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
                                <InputError message={errors.status} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="plan_start_date">Plan Start Date</Label>
                                <Input
                                    id="plan_start_date"
                                    type="date"
                                    value={data.plan_start_date}
                                    onChange={(e) => setData('plan_start_date', e.target.value)}
                                />
                                <InputError message={errors.plan_start_date} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="plan_end_date">Plan End Date</Label>
                                <Input
                                    id="plan_end_date"
                                    type="date"
                                    value={data.plan_end_date}
                                    onChange={(e) => setData('plan_end_date', e.target.value)}
                                />
                                <InputError message={errors.plan_end_date} />
                            </div>
                            <div className="space-y-2">
                                <Label>Management Type *</Label>
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
                                <InputError message={errors.management_type} />
                            </div>
                        </div>
                    </div>

                    {/* Funding Amounts */}
                    <div className="space-y-4">
                        <h2 className="text-base font-medium text-muted-foreground">Funding Amounts</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="core_total">Core Total ($)</Label>
                                <Input
                                    id="core_total"
                                    type="number"
                                    step="0.01"
                                    value={data.core_total}
                                    onChange={(e) => setData('core_total', e.target.value)}
                                />
                                <InputError message={errors.core_total} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="capacity_total">Capacity Building Total ($)</Label>
                                <Input
                                    id="capacity_total"
                                    type="number"
                                    step="0.01"
                                    value={data.capacity_total}
                                    onChange={(e) => setData('capacity_total', e.target.value)}
                                />
                                <InputError message={errors.capacity_total} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="capital_total">Capital Total ($)</Label>
                                <Input
                                    id="capital_total"
                                    type="number"
                                    step="0.01"
                                    value={data.capital_total}
                                    onChange={(e) => setData('capital_total', e.target.value)}
                                />
                                <InputError message={errors.capital_total} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="total_funding">Total Funding ($)</Label>
                                <Input
                                    id="total_funding"
                                    type="number"
                                    step="0.01"
                                    value={data.total_funding}
                                    onChange={(e) => setData('total_funding', e.target.value)}
                                />
                                <InputError message={errors.total_funding} />
                            </div>
                        </div>
                    </div>

                    {/* NDIA Contact */}
                    <div className="space-y-4">
                        <h2 className="text-base font-medium text-muted-foreground">NDIA Contact</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="ndia_contact_name">Contact Name</Label>
                                <Input
                                    id="ndia_contact_name"
                                    value={data.ndia_contact_name}
                                    onChange={(e) => setData('ndia_contact_name', e.target.value)}
                                />
                                <InputError message={errors.ndia_contact_name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ndia_contact_phone">Contact Phone</Label>
                                <Input
                                    id="ndia_contact_phone"
                                    value={data.ndia_contact_phone}
                                    onChange={(e) => setData('ndia_contact_phone', e.target.value)}
                                />
                                <InputError message={errors.ndia_contact_phone} />
                            </div>
                        </div>
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

PlansEdit.layout = (page: React.ReactNode) => <AppLayout children={page} />;
