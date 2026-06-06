import { Head, Link, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import InputError from '@/components/input-error';
import type { Shift } from '@/types/models';

const statusVariant = (status: string) =>
    ({
        scheduled: 'default',
        in_progress: 'secondary',
        completed: 'outline',
        cancelled: 'destructive',
    } as const)[status as 'scheduled' | 'in_progress' | 'completed' | 'cancelled'] ?? 'outline';

const formatDatetime = (value: string | null) => {
    if (!value) return '—';
    return new Date(value).toLocaleString();
};

function AddHandoverSheet({ shift }: { shift: Shift }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        staff_id: shift.staff_id,
        content: '',
        status: 'draft',
    });

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-1 size-4" />
                    Add Handover
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Add Handover Note</SheetTitle>
                </SheetHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(`/shifts/${shift.id}/handover`, {
                            onSuccess: () => {
                                setOpen(false);
                                reset();
                            },
                        });
                    }}
                    className="mt-6 space-y-4"
                >
                    <div className="space-y-2">
                        <Label>Content *</Label>
                        <textarea
                            className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                            rows={5}
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                        />
                        <InputError message={errors.content} />
                    </div>
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="submitted">Submitted</SelectItem>
                                <SelectItem value="reviewed">Reviewed</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>
                    <Button type="submit" disabled={processing} className="w-full">
                        Add Handover Note
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    );
}

function CancelShiftSheet({ shift }: { shift: Shift }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        cancelled_by_type: 'provider',
        reason_code: '',
        reason_notes: '',
        billable: false,
    });

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="destructive" size="sm">
                    Cancel Shift
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Cancel Shift</SheetTitle>
                </SheetHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(`/shifts/${shift.id}/cancel`, {
                            onSuccess: () => {
                                setOpen(false);
                                reset();
                            },
                        });
                    }}
                    className="mt-6 space-y-4"
                >
                    <div className="space-y-2">
                        <Label>Cancelled By</Label>
                        <Select value={data.cancelled_by_type} onValueChange={(v) => setData('cancelled_by_type', v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="participant">Participant</SelectItem>
                                <SelectItem value="provider">Provider</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.cancelled_by_type} />
                    </div>
                    <div className="space-y-2">
                        <Label>Reason Code</Label>
                        <input
                            className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                            value={data.reason_code}
                            onChange={(e) => setData('reason_code', e.target.value)}
                            placeholder="e.g. NSDH"
                        />
                        <InputError message={errors.reason_code} />
                    </div>
                    <div className="space-y-2">
                        <Label>Reason Notes</Label>
                        <textarea
                            className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                            rows={3}
                            value={data.reason_notes}
                            onChange={(e) => setData('reason_notes', e.target.value)}
                        />
                        <InputError message={errors.reason_notes} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="billable"
                            checked={data.billable}
                            onCheckedChange={(v) => setData('billable', Boolean(v))}
                        />
                        <Label htmlFor="billable">Billable cancellation</Label>
                    </div>
                    <Button type="submit" disabled={processing} className="w-full" variant="destructive">
                        Confirm Cancellation
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    );
}

export default function ShiftsShow({ shift }: { shift: Shift }) {
    return (
        <>
            <Head title={`Shift — ${shift.participant?.full_name ?? 'Unknown'}`} />
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold">{shift.participant?.full_name ?? 'Unknown Participant'}</h1>
                        <div className="text-muted-foreground flex items-center gap-2 text-sm">
                            <Badge variant={statusVariant(shift.status)}>
                                {shift.status.replace('_', ' ')}
                            </Badge>
                            {shift.scheduled_start && (
                                <span>
                                    {formatDatetime(shift.scheduled_start)}
                                    {shift.scheduled_end && ` — ${formatDatetime(shift.scheduled_end)}`}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild>
                            <Link href={`/shifts/${shift.id}/edit`}>
                                <Pencil className="mr-2 size-4" />
                                Edit
                            </Link>
                        </Button>
                        {shift.status !== 'cancelled' && <CancelShiftSheet shift={shift} />}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                if (confirm('Delete this shift? This cannot be undone.')) {
                                    router.delete(`/shifts/${shift.id}`);
                                }
                            }}
                        >
                            <Trash2 className="text-destructive size-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {/* Shift Details Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Shift Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div>
                                <span className="text-muted-foreground">Participant:</span>{' '}
                                {shift.participant?.full_name ?? '—'}
                            </div>
                            <div>
                                <span className="text-muted-foreground">Staff:</span>{' '}
                                {shift.staff?.full_name ?? '—'}
                            </div>
                            <div>
                                <span className="text-muted-foreground">Service Type:</span>{' '}
                                {shift.service_type?.name ?? '—'}
                            </div>
                            <div>
                                <span className="text-muted-foreground">Scheduled Start:</span>{' '}
                                {formatDatetime(shift.scheduled_start)}
                            </div>
                            <div>
                                <span className="text-muted-foreground">Scheduled End:</span>{' '}
                                {formatDatetime(shift.scheduled_end)}
                            </div>
                            <div>
                                <span className="text-muted-foreground">Actual Start:</span>{' '}
                                {formatDatetime(shift.actual_start)}
                            </div>
                            <div>
                                <span className="text-muted-foreground">Actual End:</span>{' '}
                                {formatDatetime(shift.actual_end)}
                            </div>
                            <div>
                                <span className="text-muted-foreground">Location:</span>{' '}
                                {shift.location ?? '—'}
                            </div>
                            <div>
                                <span className="text-muted-foreground">Transport Required:</span>{' '}
                                {shift.requires_transport ? 'Yes' : 'No'}
                            </div>
                            <div>
                                <span className="text-muted-foreground">KMs Travelled:</span>{' '}
                                {shift.kms_travelled ?? '—'}
                            </div>
                            {shift.notes && (
                                <div>
                                    <span className="text-muted-foreground">Notes:</span>{' '}
                                    {shift.notes}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Cancellation Card */}
                    {shift.cancellation && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Cancellation</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Cancelled By:</span>{' '}
                                    {shift.cancellation.cancelled_by_type}
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Reason Code:</span>{' '}
                                    {shift.cancellation.reason_code ?? '—'}
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Reason Notes:</span>{' '}
                                    {shift.cancellation.reason_notes ?? '—'}
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Billable:</span>{' '}
                                    <Badge variant={shift.cancellation.billable ? 'default' : 'outline'} className="text-xs">
                                        {shift.cancellation.billable ? 'Yes' : 'No'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Handover Notes */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            Handover Notes
                            {(shift.handover_notes ?? []).length > 0 && ` (${shift.handover_notes!.length})`}
                        </h2>
                        <AddHandoverSheet shift={shift} />
                    </div>
                    {(shift.handover_notes ?? []).length === 0 ? (
                        <p className="text-muted-foreground text-sm">No handover notes yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {shift.handover_notes!.map((note) => (
                                <Card key={note.id}>
                                    <CardContent className="space-y-2 pt-4 text-sm">
                                        <div className="flex items-start justify-between">
                                            <p className="flex-1">{note.content}</p>
                                            <Badge variant="outline" className="ml-2 text-xs">
                                                {note.status}
                                            </Badge>
                                        </div>
                                        {note.submitted_at && (
                                            <p className="text-muted-foreground text-xs">
                                                Submitted: {formatDatetime(note.submitted_at)}
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

ShiftsShow.layout = (page: React.ReactNode) => <AppLayout children={page} />;
