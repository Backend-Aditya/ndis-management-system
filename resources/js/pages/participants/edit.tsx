import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormSection } from '@/components/form/form-section';
import { FormField } from '@/components/form/form-field';
import { FormActions } from '@/components/form/form-actions';
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
                    <FormSection title="NDIS Details">
                        <FormField label="NDIS Number" htmlFor="ndis_number" error={errors.ndis_number} required>
                            <Input
                                id="ndis_number"
                                value={data.ndis_number}
                                onChange={(e) => setData('ndis_number', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Status" error={errors.participant_status} required>
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
                        </FormField>
                    </FormSection>

                    <FormSection title="Personal Details">
                        <FormField label="First Name" htmlFor="first_name" error={errors.first_name} required>
                            <Input
                                id="first_name"
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Last Name" htmlFor="last_name" error={errors.last_name} required>
                            <Input
                                id="last_name"
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Date of Birth" htmlFor="date_of_birth" error={errors.date_of_birth} required>
                            <Input
                                id="date_of_birth"
                                type="date"
                                value={data.date_of_birth}
                                onChange={(e) => setData('date_of_birth', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Gender" error={errors.gender}>
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
                        </FormField>
                        <FormField label="Pronouns" htmlFor="pronouns" error={errors.pronouns}>
                            <Input
                                id="pronouns"
                                placeholder="e.g. they/them"
                                value={data.pronouns}
                                onChange={(e) => setData('pronouns', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Primary Language" htmlFor="primary_language" error={errors.primary_language}>
                            <Input
                                id="primary_language"
                                value={data.primary_language}
                                onChange={(e) => setData('primary_language', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Cultural Background" htmlFor="cultural_background" error={errors.cultural_background}>
                            <Input
                                id="cultural_background"
                                value={data.cultural_background}
                                onChange={(e) => setData('cultural_background', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Communication Needs" htmlFor="communication_needs" error={errors.communication_needs} full>
                            <textarea
                                id="communication_needs"
                                className="border-input bg-background min-h-[90px] w-full rounded-md border px-3 py-2 text-sm"
                                value={data.communication_needs}
                                onChange={(e) => setData('communication_needs', e.target.value)}
                            />
                        </FormField>
                        <div className="flex items-center gap-2 sm:col-span-2">
                            <Checkbox
                                id="interpreter_required"
                                checked={data.interpreter_required}
                                onCheckedChange={(v) => setData('interpreter_required', Boolean(v))}
                            />
                            <Label htmlFor="interpreter_required">Interpreter required</Label>
                        </div>
                    </FormSection>

                    <FormSection title="Address">
                        <FormField label="Street Address" htmlFor="address" error={errors.address} full>
                            <Input
                                id="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Suburb" htmlFor="suburb" error={errors.suburb}>
                            <Input
                                id="suburb"
                                value={data.suburb}
                                onChange={(e) => setData('suburb', e.target.value)}
                            />
                        </FormField>
                        <FormField label="State" error={errors.state}>
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
                        </FormField>
                        <FormField label="Postcode" htmlFor="postcode" error={errors.postcode}>
                            <Input
                                id="postcode"
                                value={data.postcode}
                                onChange={(e) => setData('postcode', e.target.value)}
                            />
                        </FormField>
                    </FormSection>

                    <FormActions>
                        <Button type="button" variant="outline" onClick={() => history.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Save Changes
                        </Button>
                    </FormActions>
                </form>
            </div>
        </>
    );
}

ParticipantsEdit.layout = (page: React.ReactNode) => <AppLayout children={page} />;
