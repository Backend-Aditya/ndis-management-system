import { Head, Link, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InputError from '@/components/input-error';
import type { Participant } from '@/types/models';

const statusVariant = (status: string) =>
    ({ active: 'default', inactive: 'secondary', pending: 'outline' } as const)[
        status as 'active' | 'inactive' | 'pending'
    ] ?? 'outline';

function AddContactSheet({ participantId }: { participantId: string }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        relationship: '',
        phone: '',
        email: '',
        is_emergency: false,
        is_authorised_rep: false,
    });

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-1 size-4" />
                    Add Contact
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Add Contact</SheetTitle>
                </SheetHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(`/participants/${participantId}/contacts`, {
                            onSuccess: () => {
                                setOpen(false);
                                reset();
                            },
                        });
                    }}
                    className="mt-6 space-y-4"
                >
                    <div className="space-y-2">
                        <Label htmlFor="c_first_name">First Name *</Label>
                        <Input
                            id="c_first_name"
                            value={data.first_name}
                            onChange={(e) => setData('first_name', e.target.value)}
                        />
                        <InputError message={errors.first_name} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="c_last_name">Last Name *</Label>
                        <Input
                            id="c_last_name"
                            value={data.last_name}
                            onChange={(e) => setData('last_name', e.target.value)}
                        />
                        <InputError message={errors.last_name} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="c_relationship">Relationship</Label>
                        <Input
                            id="c_relationship"
                            value={data.relationship}
                            onChange={(e) => setData('relationship', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="c_phone">Phone</Label>
                        <Input
                            id="c_phone"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="c_email">Email</Label>
                        <Input
                            id="c_email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    <Button type="submit" disabled={processing} className="w-full">
                        Add Contact
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    );
}

function AddGoalSheet({ participantId }: { participantId: string }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        goal_text: '',
        category: '',
        status: 'active',
        target_date: '',
        progress_notes: '',
    });

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-1 size-4" />
                    Add Goal
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Add Goal</SheetTitle>
                </SheetHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(`/participants/${participantId}/goals`, {
                            onSuccess: () => {
                                setOpen(false);
                                reset();
                            },
                        });
                    }}
                    className="mt-6 space-y-4"
                >
                    <div className="space-y-2">
                        <Label>Goal *</Label>
                        <textarea
                            className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                            rows={3}
                            value={data.goal_text}
                            onChange={(e) => setData('goal_text', e.target.value)}
                        />
                        <InputError message={errors.goal_text} />
                    </div>
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Input
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            placeholder="e.g. Daily Living"
                        />
                    </div>
                    <Button type="submit" disabled={processing} className="w-full">
                        Add Goal
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    );
}

function AddDiagnosisSheet({ participantId }: { participantId: string }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        diagnosis_name: '',
        icd_10_code: '',
        diagnosed_date: '',
        is_primary: false,
    });

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-1 size-4" />
                    Add Diagnosis
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Add Diagnosis</SheetTitle>
                </SheetHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(`/participants/${participantId}/diagnoses`, {
                            onSuccess: () => {
                                setOpen(false);
                                reset();
                            },
                        });
                    }}
                    className="mt-6 space-y-4"
                >
                    <div className="space-y-2">
                        <Label>Diagnosis Name *</Label>
                        <Input
                            value={data.diagnosis_name}
                            onChange={(e) => setData('diagnosis_name', e.target.value)}
                        />
                        <InputError message={errors.diagnosis_name} />
                    </div>
                    <div className="space-y-2">
                        <Label>ICD-10 Code</Label>
                        <Input
                            value={data.icd_10_code}
                            onChange={(e) => setData('icd_10_code', e.target.value)}
                            placeholder="e.g. F84.0"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Date Diagnosed</Label>
                        <Input
                            type="date"
                            value={data.diagnosed_date}
                            onChange={(e) => setData('diagnosed_date', e.target.value)}
                        />
                    </div>
                    <Button type="submit" disabled={processing} className="w-full">
                        Add Diagnosis
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    );
}

export default function ParticipantsShow({ participant }: { participant: Participant }) {
    return (
        <>
            <Head title={participant.full_name} />
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold">{participant.full_name}</h1>
                        <div className="text-muted-foreground flex items-center gap-2 text-sm">
                            <span>NDIS: {participant.ndis_number}</span>
                            <Badge variant={statusVariant(participant.participant_status)}>
                                {participant.participant_status}
                            </Badge>
                            {participant.interpreter_required && (
                                <Badge variant="outline">Interpreter needed</Badge>
                            )}
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={`/participants/${participant.id}/edit`}>
                            <Pencil className="mr-2 size-4" />
                            Edit
                        </Link>
                    </Button>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="overview">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="contacts">
                            Contacts{participant.contacts?.length ? ` (${participant.contacts.length})` : ''}
                        </TabsTrigger>
                        <TabsTrigger value="goals">
                            Goals{participant.goals?.length ? ` (${participant.goals.length})` : ''}
                        </TabsTrigger>
                        <TabsTrigger value="diagnoses">
                            Diagnoses{participant.diagnoses?.length ? ` (${participant.diagnoses.length})` : ''}
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="mt-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Personal</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">DOB:</span>{' '}
                                        {participant.date_of_birth ?? '—'}
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Gender:</span>{' '}
                                        {participant.gender ?? '—'}
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Pronouns:</span>{' '}
                                        {participant.pronouns ?? '—'}
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Language:</span>{' '}
                                        {participant.primary_language ?? '—'}
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Cultural background:</span>{' '}
                                        {participant.cultural_background ?? '—'}
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Communication needs:</span>{' '}
                                        {participant.communication_needs ?? '—'}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Address</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <div>{participant.address ?? '—'}</div>
                                    <div>
                                        {[participant.suburb, participant.state, participant.postcode]
                                            .filter(Boolean)
                                            .join(', ') || '—'}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Contacts Tab */}
                    <TabsContent value="contacts" className="mt-4">
                        <div className="space-y-4">
                            <div className="flex justify-end">
                                <AddContactSheet participantId={participant.id} />
                            </div>
                            {(participant.contacts ?? []).length === 0 ? (
                                <p className="text-muted-foreground text-sm">No contacts added yet.</p>
                            ) : (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {participant.contacts!.map((c) => (
                                        <Card key={c.id}>
                                            <CardContent className="space-y-1 pt-4 text-sm">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="font-medium">
                                                            {c.first_name} {c.last_name}
                                                        </p>
                                                        <p className="text-muted-foreground">
                                                            {c.relationship ?? '—'}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            router.delete(
                                                                `/participants/${participant.id}/contacts/${c.id}`,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="text-destructive size-4" />
                                                    </Button>
                                                </div>
                                                {c.is_emergency && (
                                                    <Badge variant="destructive" className="text-xs">
                                                        Emergency
                                                    </Badge>
                                                )}
                                                {c.is_authorised_rep && (
                                                    <Badge variant="outline" className="text-xs">
                                                        Authorised Rep
                                                    </Badge>
                                                )}
                                                <p>{c.phone ?? '—'}</p>
                                                <p>{c.email ?? '—'}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Goals Tab */}
                    <TabsContent value="goals" className="mt-4">
                        <div className="space-y-4">
                            <div className="flex justify-end">
                                <AddGoalSheet participantId={participant.id} />
                            </div>
                            {(participant.goals ?? []).length === 0 ? (
                                <p className="text-muted-foreground text-sm">No goals added yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {participant.goals!.map((g) => (
                                        <Card key={g.id}>
                                            <CardContent className="space-y-2 pt-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <p className="text-sm">{g.goal_text}</p>
                                                        {g.category && (
                                                            <p className="text-muted-foreground mt-1 text-xs">
                                                                {g.category}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            variant={
                                                                g.status === 'completed' ? 'default' : 'outline'
                                                            }
                                                            className="text-xs"
                                                        >
                                                            {g.status}
                                                        </Badge>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                router.delete(
                                                                    `/participants/${participant.id}/goals/${g.id}`,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="text-destructive size-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                {g.target_date && (
                                                    <p className="text-muted-foreground text-xs">
                                                        Target: {g.target_date}
                                                    </p>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Diagnoses Tab */}
                    <TabsContent value="diagnoses" className="mt-4">
                        <div className="space-y-4">
                            <div className="flex justify-end">
                                <AddDiagnosisSheet participantId={participant.id} />
                            </div>
                            {(participant.diagnoses ?? []).length === 0 ? (
                                <p className="text-muted-foreground text-sm">No diagnoses recorded yet.</p>
                            ) : (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {participant.diagnoses!.map((d) => (
                                        <Card key={d.id}>
                                            <CardContent className="space-y-1 pt-4 text-sm">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="font-medium">{d.diagnosis_name}</p>
                                                        {d.icd_10_code && (
                                                            <p className="text-muted-foreground text-xs">
                                                                {d.icd_10_code}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            router.delete(
                                                                `/participants/${participant.id}/diagnoses/${d.id}`,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="text-destructive size-4" />
                                                    </Button>
                                                </div>
                                                {d.is_primary && <Badge className="text-xs">Primary</Badge>}
                                                {d.diagnosed_date && (
                                                    <p className="text-muted-foreground">
                                                        Diagnosed: {d.diagnosed_date}
                                                    </p>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}

ParticipantsShow.layout = (page: React.ReactNode) => <AppLayout children={page} />;
