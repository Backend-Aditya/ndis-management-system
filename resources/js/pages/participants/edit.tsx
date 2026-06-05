import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import type { Participant } from '@/types/models';

export default function ParticipantsEdit({ participant }: { participant: Participant }) {
    const { data, setData, put, processing, errors } = useForm({
        ndis_number: participant.ndis_number,
        first_name: participant.first_name,
        last_name: participant.last_name,
        date_of_birth: participant.date_of_birth ?? '',
        gender: participant.gender ?? '',
        pronouns: participant.pronouns ?? '',
        address: participant.address ?? '',
        suburb: participant.suburb ?? '',
        state: participant.state ?? '',
        postcode: participant.postcode ?? '',
        primary_language: participant.primary_language ?? 'English',
        interpreter_required: participant.interpreter_required,
        communication_needs: participant.communication_needs ?? '',
        cultural_background: participant.cultural_background ?? '',
        participant_status: participant.participant_status,
    });

    return (
        <>
            <Head title={`Edit ${participant.full_name}`} />
            <div className="max-w-3xl space-y-6 p-6">
                <h1 className="text-2xl font-semibold">Edit {participant.full_name}</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        put(`/participants/${participant.id}`);
                    }}
                    className="space-y-6"
                >
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="ndis_number">NDIS Number *</Label>
                            <Input
                                id="ndis_number"
                                value={data.ndis_number}
                                onChange={(e) => setData('ndis_number', e.target.value)}
                            />
                            <InputError message={errors.ndis_number} />
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select
                                value={data.participant_status}
                                onValueChange={(v) => setData('participant_status', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.participant_status} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="first_name">First Name *</Label>
                            <Input
                                id="first_name"
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                            />
                            <InputError message={errors.first_name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last_name">Last Name *</Label>
                            <Input
                                id="last_name"
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                            />
                            <InputError message={errors.last_name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date_of_birth">Date of Birth *</Label>
                            <Input
                                id="date_of_birth"
                                type="date"
                                value={data.date_of_birth}
                                onChange={(e) => setData('date_of_birth', e.target.value)}
                            />
                            <InputError message={errors.date_of_birth} />
                        </div>
                        <div className="space-y-2">
                            <Label>Gender</Label>
                            <Select value={data.gender} onValueChange={(v) => setData('gender', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="non_binary">Non-binary</SelectItem>
                                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="suburb">Suburb</Label>
                            <Input
                                id="suburb"
                                value={data.suburb}
                                onChange={(e) => setData('suburb', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>State</Label>
                            <Select value={data.state} onValueChange={(v) => setData('state', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                                <SelectContent>
                                    {['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'ACT', 'NT'].map((s) => (
                                        <SelectItem key={s} value={s}>
                                            {s}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="primary_language">Primary Language</Label>
                            <Input
                                id="primary_language"
                                value={data.primary_language}
                                onChange={(e) => setData('primary_language', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="interpreter_required"
                            checked={data.interpreter_required}
                            onCheckedChange={(v) => setData('interpreter_required', Boolean(v))}
                        />
                        <Label htmlFor="interpreter_required">Interpreter required</Label>
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

ParticipantsEdit.layout = (page: React.ReactNode) => <AppLayout children={page} />;
