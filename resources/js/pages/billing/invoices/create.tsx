import { Head, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormSection } from '@/components/form/form-section';
import { FormField } from '@/components/form/form-field';
import { FormActions } from '@/components/form/form-actions';
import InputError from '@/components/input-error';
import type { NdisPlan, Participant, ServiceType } from '@/types/models';

interface LineItem {
    service_type_id: string;
    description: string;
    service_date: string;
    quantity: string;
    unit_price: string;
}

interface Props {
    participants: { data: Participant[] };
    plans: { data: NdisPlan[] };
    serviceTypes: { data: ServiceType[] };
}

const emptyLineItem = (): LineItem => ({
    service_type_id: '',
    description: '',
    service_date: '',
    quantity: '',
    unit_price: '',
});

export default function InvoicesCreate({ participants, plans, serviceTypes }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        participant_id: '',
        plan_id: '',
        invoice_date: '',
        due_date: '',
        line_items: [emptyLineItem()],
    });

    const subtotal = data.line_items.reduce(
        (sum, li) => sum + parseFloat(li.quantity || '0') * parseFloat(li.unit_price || '0'),
        0,
    );
    const gst = subtotal * 0.1;
    const total = subtotal + gst;

    const addLineItem = () => {
        setData('line_items', [...data.line_items, emptyLineItem()]);
    };

    const removeLineItem = (index: number) => {
        setData(
            'line_items',
            data.line_items.filter((_, i) => i !== index),
        );
    };

    const updateLineItem = (index: number, field: keyof LineItem, value: string) => {
        const updated = data.line_items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
        setData('line_items', updated);
    };

    return (
        <>
            <Head title="Create Invoice" />
            <div className="max-w-4xl space-y-6 p-6">
                <h1 className="text-2xl font-semibold">Create Invoice</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/invoices');
                    }}
                    className="space-y-6"
                >
                    <FormSection title="Invoice">
                        <FormField label="Participant" error={errors.participant_id} required>
                            <Select value={data.participant_id} onValueChange={(v) => setData('participant_id', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select participant" />
                                </SelectTrigger>
                                <SelectContent>
                                    {participants.data.map((p) => (
                                        <SelectItem key={p.id} value={p.id}>
                                            {p.full_name} — {p.ndis_number}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormField>
                        <FormField label="Plan" error={errors.plan_id} required>
                            <Select value={data.plan_id} onValueChange={(v) => setData('plan_id', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select plan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {plans.data.map((p) => (
                                        <SelectItem key={p.id} value={p.id}>
                                            {p.plan_number ?? p.id}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormField>
                        <FormField label="Invoice Date" htmlFor="invoice_date" error={errors.invoice_date}>
                            <Input
                                id="invoice_date"
                                type="date"
                                value={data.invoice_date}
                                onChange={(e) => setData('invoice_date', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Due Date" htmlFor="due_date" error={errors.due_date}>
                            <Input
                                id="due_date"
                                type="date"
                                value={data.due_date}
                                onChange={(e) => setData('due_date', e.target.value)}
                            />
                        </FormField>
                    </FormSection>

                    {/* Line Items */}
                    <div className="space-y-4 rounded-lg border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-semibold">Line Items</h2>
                            <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
                                <Plus className="mr-1 size-4" />
                                Add Line Item
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {data.line_items.map((item, index) => (
                                <div key={index} className="relative rounded-md border p-4">
                                    {data.line_items.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-2 top-2"
                                            onClick={() => removeLineItem(index)}
                                        >
                                            <Trash2 className="text-destructive size-4" />
                                        </Button>
                                    )}
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        <div className="space-y-2">
                                            <Select
                                                value={item.service_type_id}
                                                onValueChange={(v) => updateLineItem(index, 'service_type_id', v)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select service type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {serviceTypes.data.map((st) => (
                                                        <SelectItem key={st.id} value={st.id}>
                                                            {st.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={(errors as Record<string, string>)[`line_items.${index}.service_type_id`]} />
                                        </div>
                                        <div className="space-y-2 lg:col-span-2">
                                            <Input
                                                value={item.description}
                                                onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                                                placeholder="Service description"
                                            />
                                            <InputError message={(errors as Record<string, string>)[`line_items.${index}.description`]} />
                                        </div>
                                        <div className="space-y-2">
                                            <Input
                                                type="date"
                                                value={item.service_date}
                                                onChange={(e) => updateLineItem(index, 'service_date', e.target.value)}
                                            />
                                            <InputError message={(errors as Record<string, string>)[`line_items.${index}.service_date`]} />
                                        </div>
                                        <div className="space-y-2">
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={item.quantity}
                                                onChange={(e) => updateLineItem(index, 'quantity', e.target.value)}
                                                placeholder="Qty"
                                            />
                                            <InputError message={(errors as Record<string, string>)[`line_items.${index}.quantity`]} />
                                        </div>
                                        <div className="space-y-2">
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={item.unit_price}
                                                onChange={(e) => updateLineItem(index, 'unit_price', e.target.value)}
                                                placeholder="Unit price ($)"
                                            />
                                            <InputError message={(errors as Record<string, string>)[`line_items.${index}.unit_price`]} />
                                        </div>
                                    </div>
                                    <div className="mt-2 text-right text-sm text-muted-foreground">
                                        Line total: ${(parseFloat(item.quantity || '0') * parseFloat(item.unit_price || '0')).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Totals Preview */}
                    <div className="rounded-md border p-4">
                        <h2 className="mb-3 text-base font-medium text-muted-foreground">Totals (Preview)</h2>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">GST (10%)</span>
                                <span>${gst.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-semibold">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <FormActions>
                        <Button type="button" variant="outline" onClick={() => history.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Create Invoice
                        </Button>
                    </FormActions>
                </form>
            </div>
        </>
    );
}

InvoicesCreate.layout = (page: React.ReactNode) => <AppLayout children={page} />;
