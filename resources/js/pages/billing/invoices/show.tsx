import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import InputError from '@/components/input-error';
import type { Invoice } from '@/types/models';

const invoiceStatusVariant = (status: string) =>
    ({
        draft: 'secondary',
        sent: 'outline',
        paid: 'default',
        overdue: 'destructive',
    } as const)[status as 'draft' | 'sent' | 'paid' | 'overdue'] ?? 'outline';

const claimStatusVariant = (status: string) =>
    ({
        pending: 'secondary',
        submitted: 'default',
        rejected: 'destructive',
        paid: 'outline',
    } as const)[status as 'pending' | 'submitted' | 'rejected' | 'paid'] ?? 'outline';

const formatDate = (value: string | null) => {
    if (!value) return '—';
    return new Date(value).toLocaleDateString();
};

const formatCurrency = (value: string) => `$${parseFloat(value).toFixed(2)}`;

function RecordPaymentSheet({ invoice }: { invoice: Invoice }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        payment_method: 'bank_transfer',
        reference_number: '',
        payer_name: '',
        payment_date: '',
        status: 'completed',
    });

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-1 size-4" />
                    Record Payment
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Record Payment</SheetTitle>
                </SheetHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(`/invoices/${invoice.id}/payments`, {
                            onSuccess: () => {
                                setOpen(false);
                                reset();
                            },
                        });
                    }}
                    className="mt-6 space-y-4"
                >
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount ($) *</Label>
                        <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                            placeholder="0.00"
                        />
                        <InputError message={errors.amount} />
                    </div>
                    <div className="space-y-2">
                        <Label>Payment Method *</Label>
                        <Select value={data.payment_method} onValueChange={(v) => setData('payment_method', v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                <SelectItem value="credit_card">Credit Card</SelectItem>
                                <SelectItem value="direct_debit">Direct Debit</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.payment_method} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="reference_number">Reference Number</Label>
                        <Input
                            id="reference_number"
                            value={data.reference_number}
                            onChange={(e) => setData('reference_number', e.target.value)}
                        />
                        <InputError message={errors.reference_number} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="payer_name">Payer Name</Label>
                        <Input
                            id="payer_name"
                            value={data.payer_name}
                            onChange={(e) => setData('payer_name', e.target.value)}
                        />
                        <InputError message={errors.payer_name} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="payment_date">Payment Date</Label>
                        <Input
                            id="payment_date"
                            type="date"
                            value={data.payment_date}
                            onChange={(e) => setData('payment_date', e.target.value)}
                        />
                        <InputError message={errors.payment_date} />
                    </div>
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>
                    <Button type="submit" disabled={processing} className="w-full">
                        Record Payment
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    );
}

function CreateClaimSheet({ invoice }: { invoice: Invoice }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        claim_type: 'standard',
        claim_period_start: '',
        claim_period_end: '',
    });

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button size="sm" variant="outline">
                    <Plus className="mr-1 size-4" />
                    Create Claim
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Create NDIS Claim</SheetTitle>
                </SheetHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(`/invoices/${invoice.id}/claim`, {
                            onSuccess: () => {
                                setOpen(false);
                                reset();
                            },
                        });
                    }}
                    className="mt-6 space-y-4"
                >
                    <div className="space-y-2">
                        <Label>Claim Type *</Label>
                        <Select value={data.claim_type} onValueChange={(v) => setData('claim_type', v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="standard">Standard</SelectItem>
                                <SelectItem value="cancellation">Cancellation</SelectItem>
                                <SelectItem value="travel">Travel</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.claim_type} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="claim_period_start">Claim Period Start</Label>
                        <Input
                            id="claim_period_start"
                            type="date"
                            value={data.claim_period_start}
                            onChange={(e) => setData('claim_period_start', e.target.value)}
                        />
                        <InputError message={errors.claim_period_start} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="claim_period_end">Claim Period End</Label>
                        <Input
                            id="claim_period_end"
                            type="date"
                            value={data.claim_period_end}
                            onChange={(e) => setData('claim_period_end', e.target.value)}
                        />
                        <InputError message={errors.claim_period_end} />
                    </div>
                    <Button type="submit" disabled={processing} className="w-full">
                        Create Claim
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    );
}

export default function InvoicesShow({ invoice }: { invoice: Invoice }) {
    return (
        <>
            <Head title={`Invoice ${invoice.invoice_number}`} />
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold">{invoice.invoice_number}</h1>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{invoice.participant?.full_name ?? '—'}</span>
                            <Badge variant={invoiceStatusVariant(invoice.status)}>{invoice.status}</Badge>
                            <span className="font-medium text-foreground">{formatCurrency(invoice.total_amount)}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {invoice.status === 'draft' && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => router.post(`/invoices/${invoice.id}/mark-sent`)}
                            >
                                Mark Sent
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                if (confirm('Delete this invoice? This cannot be undone.')) {
                                    router.delete(`/invoices/${invoice.id}`);
                                }
                            }}
                        >
                            <Trash2 className="size-4 text-destructive" />
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {/* Invoice Details Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Invoice Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div>
                                <span className="text-muted-foreground">Participant:</span>{' '}
                                {invoice.participant?.full_name ?? '—'}
                            </div>
                            <div>
                                <span className="text-muted-foreground">Invoice Date:</span>{' '}
                                {formatDate(invoice.invoice_date)}
                            </div>
                            <div>
                                <span className="text-muted-foreground">Due Date:</span>{' '}
                                {formatDate(invoice.due_date)}
                            </div>
                            <div>
                                <span className="text-muted-foreground">Subtotal:</span>{' '}
                                {formatCurrency(invoice.subtotal)}
                            </div>
                            <div>
                                <span className="text-muted-foreground">GST:</span>{' '}
                                {formatCurrency(invoice.gst_amount)}
                            </div>
                            <div className="font-semibold">
                                <span className="text-muted-foreground font-normal">Total:</span>{' '}
                                {formatCurrency(invoice.total_amount)}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Line Items Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Line Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {(invoice.line_items ?? []).length === 0 ? (
                                <p className="text-sm text-muted-foreground">No line items.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b text-left text-muted-foreground">
                                                <th className="pb-2 pr-3">Description</th>
                                                <th className="pb-2 pr-3">Date</th>
                                                <th className="pb-2 pr-3 text-right">Qty</th>
                                                <th className="pb-2 pr-3 text-right">Unit</th>
                                                <th className="pb-2 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {invoice.line_items!.map((li) => (
                                                <tr key={li.id}>
                                                    <td className="py-2 pr-3">{li.description}</td>
                                                    <td className="py-2 pr-3">{formatDate(li.service_date)}</td>
                                                    <td className="py-2 pr-3 text-right">{li.quantity}</td>
                                                    <td className="py-2 pr-3 text-right">{formatCurrency(li.unit_price)}</td>
                                                    <td className="py-2 text-right">{formatCurrency(li.line_total)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Payments Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            Payments{(invoice.payments ?? []).length > 0 && ` (${invoice.payments!.length})`}
                        </h2>
                        <RecordPaymentSheet invoice={invoice} />
                    </div>
                    {(invoice.payments ?? []).length === 0 ? (
                        <p className="text-sm text-muted-foreground">No payments recorded.</p>
                    ) : (
                        <div className="space-y-3">
                            {invoice.payments!.map((payment) => (
                                <Card key={payment.id}>
                                    <CardContent className="pt-4 text-sm">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <div className="font-medium">{formatCurrency(payment.amount)}</div>
                                                <div className="text-muted-foreground">
                                                    {payment.payment_method.replace('_', ' ')}
                                                    {payment.payer_name && ` — ${payment.payer_name}`}
                                                </div>
                                                {payment.reference_number && (
                                                    <div className="text-muted-foreground">Ref: {payment.reference_number}</div>
                                                )}
                                                {payment.payment_date && (
                                                    <div className="text-muted-foreground">{formatDate(payment.payment_date)}</div>
                                                )}
                                            </div>
                                            <Badge variant="outline">{payment.status}</Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Claim Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">NDIS Claim</h2>
                        {!invoice.claim && <CreateClaimSheet invoice={invoice} />}
                    </div>
                    {invoice.claim ? (
                        <Card>
                            <CardContent className="space-y-2 pt-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Claim Reference:</span>{' '}
                                    {invoice.claim.claim_reference ?? '—'}
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Claim Type:</span>{' '}
                                    {invoice.claim.claim_type}
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Amount:</span>{' '}
                                    {formatCurrency(invoice.claim.claim_amount)}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">Status:</span>
                                    <Badge variant={claimStatusVariant(invoice.claim.submission_status)}>
                                        {invoice.claim.submission_status}
                                    </Badge>
                                </div>
                                {invoice.claim.claim_period_start && (
                                    <div>
                                        <span className="text-muted-foreground">Period:</span>{' '}
                                        {formatDate(invoice.claim.claim_period_start)} — {formatDate(invoice.claim.claim_period_end)}
                                    </div>
                                )}
                                {invoice.claim.submission_status === 'pending' && (
                                    <Button
                                        size="sm"
                                        className="mt-2"
                                        onClick={() => router.patch(`/claims/${invoice.claim!.id}/submit`)}
                                    >
                                        Submit Claim
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <p className="text-sm text-muted-foreground">No claim created for this invoice.</p>
                    )}
                </div>
            </div>
        </>
    );
}

InvoicesShow.layout = (page: React.ReactNode) => <AppLayout children={page} />;
