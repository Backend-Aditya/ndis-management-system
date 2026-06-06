import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ServiceAgreement } from '@/types/models';

const statusVariant = (status: string) =>
    ({
        active: 'default',
        draft: 'secondary',
        pending: 'outline',
        expired: 'secondary',
    } as const)[status as 'active' | 'draft' | 'pending' | 'expired'] ?? 'outline';

const formatCurrency = (value: string | null) =>
    value ? `$${parseFloat(value).toLocaleString('en-AU', { minimumFractionDigits: 2 })}` : '—';

export default function AgreementsShow({ agreement }: { agreement: ServiceAgreement }) {
    return (
        <>
            <Head title="Service Agreement" />
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold">
                        {agreement.participant?.full_name ?? 'Service Agreement'}
                    </h1>
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        {agreement.agreement_start && (
                            <span>
                                {agreement.agreement_start} — {agreement.agreement_end ?? 'ongoing'}
                            </span>
                        )}
                        <Badge variant={statusVariant(agreement.status)}>{agreement.status}</Badge>
                    </div>
                </div>

                {/* Items */}
                <Card>
                    <CardHeader>
                        <CardTitle>Agreement Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {(agreement.items ?? []).length === 0 ? (
                            <p className="text-muted-foreground text-sm">No items on this agreement.</p>
                        ) : (
                            <div className="space-y-3">
                                {agreement.items!.map((item) => (
                                    <div
                                        key={item.id}
                                        className="border-b pb-3 last:border-0 last:pb-0"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-medium">
                                                    {item.service_type_name ?? '—'}
                                                </p>
                                                {item.frequency && (
                                                    <p className="text-muted-foreground text-xs">
                                                        Frequency: {item.frequency}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right text-sm">
                                                <p>{formatCurrency(item.unit_price)} / unit</p>
                                                <p className="text-muted-foreground">
                                                    Qty: {item.quantity_agreed}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

AgreementsShow.layout = (page: React.ReactNode) => <AppLayout children={page} />;
