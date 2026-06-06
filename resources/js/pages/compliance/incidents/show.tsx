import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import InputError from '@/components/input-error';
import type { Incident } from '@/types/models';

const severityVariant = (severity: string) =>
    ({
        low: 'secondary',
        medium: 'outline',
        high: 'default',
        critical: 'destructive',
    } as const)[severity as 'low' | 'medium' | 'high' | 'critical'] ?? 'outline';

const statusVariant = (status: string) =>
    ({
        open: 'destructive',
        investigating: 'secondary',
        closed: 'default',
    } as const)[status as 'open' | 'investigating' | 'closed'] ?? 'outline';

const formatDatetime = (value: string | null) => {
    if (!value) return '—';
    return new Date(value).toLocaleString();
};

function AddFollowUpSheet({ incident }: { incident: Incident }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        staff_id: incident.reported_by,
        action_taken: '',
        is_resolved: false,
    });

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-1 size-4" />
                    Add Follow-up
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Add Follow-up</SheetTitle>
                </SheetHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(`/incidents/${incident.id}/follow-ups`, {
                            onSuccess: () => {
                                setOpen(false);
                                reset();
                            },
                        });
                    }}
                    className="mt-6 space-y-4"
                >
                    <div className="space-y-2">
                        <Label>Action Taken *</Label>
                        <textarea
                            className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                            rows={5}
                            value={data.action_taken}
                            onChange={(e) => setData('action_taken', e.target.value)}
                        />
                        <InputError message={errors.action_taken} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="is_resolved"
                            checked={data.is_resolved}
                            onCheckedChange={(v) => setData('is_resolved', Boolean(v))}
                        />
                        <Label htmlFor="is_resolved">Mark as resolved</Label>
                    </div>
                    <Button type="submit" disabled={processing} className="w-full">
                        Add Follow-up
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    );
}

export default function IncidentsShow({ incident }: { incident: Incident }) {
    return (
        <>
            <Head title={`Incident — ${incident.participant?.full_name ?? 'Unknown'}`} />
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold">{incident.participant?.full_name ?? 'Unknown Participant'}</h1>
                        <div className="text-muted-foreground flex items-center gap-2 text-sm">
                            <Badge variant={severityVariant(incident.severity)}>{incident.severity}</Badge>
                            <Badge variant={statusVariant(incident.status)}>{incident.status.replace('_', ' ')}</Badge>
                            {incident.occurred_at && <span>{formatDatetime(incident.occurred_at)}</span>}
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            if (confirm('Delete this incident? This cannot be undone.')) {
                                router.delete(`/incidents/${incident.id}`);
                            }
                        }}
                    >
                        <Trash2 className="text-destructive size-4" />
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {/* Incident Details Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Incident Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div>
                                <span className="text-muted-foreground">Incident Type:</span>{' '}
                                {incident.incident_type.replace(/_/g, ' ')}
                            </div>
                            <div>
                                <span className="text-muted-foreground">Severity:</span>{' '}
                                {incident.severity}
                            </div>
                            <div>
                                <span className="text-muted-foreground">Occurred At:</span>{' '}
                                {formatDatetime(incident.occurred_at)}
                            </div>
                            <div>
                                <span className="text-muted-foreground">Description:</span>{' '}
                                {incident.description}
                            </div>
                            {incident.immediate_actions && (
                                <div>
                                    <span className="text-muted-foreground">Immediate Actions:</span>{' '}
                                    {incident.immediate_actions}
                                </div>
                            )}
                            <div>
                                <span className="text-muted-foreground">Participant Notified:</span>{' '}
                                {incident.notified_participant ? 'Yes' : 'No'}
                            </div>
                            <div>
                                <span className="text-muted-foreground">NDIS Commission Notified:</span>{' '}
                                {incident.notified_ndis_commission ? 'Yes' : 'No'}
                            </div>
                            {incident.ndis_reportable_type && (
                                <div>
                                    <span className="text-muted-foreground">NDIS Reportable Type:</span>{' '}
                                    {incident.ndis_reportable_type}
                                </div>
                            )}
                            <div>
                                <span className="text-muted-foreground">Reported By:</span>{' '}
                                {incident.reporter?.full_name ?? '—'}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Follow-ups */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            Follow-ups
                            {(incident.follow_ups ?? []).length > 0 && ` (${incident.follow_ups!.length})`}
                        </h2>
                        <AddFollowUpSheet incident={incident} />
                    </div>
                    {(incident.follow_ups ?? []).length === 0 ? (
                        <p className="text-muted-foreground text-sm">No follow-ups yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {incident.follow_ups!.map((followUp) => (
                                <Card key={followUp.id}>
                                    <CardContent className="space-y-2 pt-4 text-sm">
                                        <div className="flex items-start justify-between">
                                            <p className="flex-1">{followUp.action_taken}</p>
                                            <Badge
                                                variant={followUp.is_resolved ? 'default' : 'secondary'}
                                                className="ml-2 text-xs"
                                            >
                                                {followUp.is_resolved ? 'Resolved' : 'Pending'}
                                            </Badge>
                                        </div>
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

IncidentsShow.layout = (page: React.ReactNode) => <AppLayout children={page} />;
