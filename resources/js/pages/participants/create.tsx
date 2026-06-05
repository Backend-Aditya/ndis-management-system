import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';

export default function ParticipantsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        ndis_number: '',
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        pronouns: '',
        address: '',
        suburb: '',
        state: '',
        postcode: '',
        primary_language: 'English',
        interpreter_required: false,
        communication_needs: '',
        cultural_background: '',
        participant_status: 'active',
    });

    return (
        <>
            <Head title="Add Participant" />
            <div className="max-w-3xl space-y-6 p-6">
                <h1 className="text-2xl font-semibold">Add Participant</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/participants');
                    }}
                    className="space-y-6"
                >
                    {/* NDIS Details */}
                    <div className="space-y-4">
                        <h2 className="text-base font-medium text-muted-foreground">NDIS Details</h2>
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
                                <Label>Status *</Label>
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
                        </div>
                    </div>

                    {/* Personal Details */}
                    <div className="space-y-4">
                        <h2 className="text-base font-medium text-muted-foreground">Personal Details</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
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
                                <InputError message={errors.gender} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pronouns">Pronouns</Label>
                                <Input
                                    id="pronouns"
                                    placeholder="e.g. they/them"
                                    value={data.pronouns}
                                    onChange={(e) => setData('pronouns', e.target.value)}
                                />
                                <InputError message={errors.pronouns} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="primary_language">Primary Language</Label>
                                <Input
                                    id="primary_language"
                                    value={data.primary_language}
                                    onChange={(e) => setData('primary_language', e.target.value)}
                                />
                                <InputError message={errors.primary_language} />
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
                    </div>

                    {/* Address */}
                    <div className="space-y-4">
                        <h2 className="text-base font-medium text-muted-foreground">Address</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="address">Street Address</Label>
                                <Input
                                    id="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                />
                                <InputError message={errors.address} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="suburb">Suburb</Label>
                                <Input
                                    id="suburb"
                                    value={data.suburb}
                                    onChange={(e) => setData('suburb', e.target.value)}
                                />
                                <InputError message={errors.suburb} />
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
                                <InputError message={errors.state} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="postcode">Postcode</Label>
                                <Input
                                    id="postcode"
                                    value={data.postcode}
                                    onChange={(e) => setData('postcode', e.target.value)}
                                />
                                <InputError message={errors.postcode} />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>
                            Add Participant
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

ParticipantsCreate.layout = (page: React.ReactNode) => <AppLayout children={page} />;
