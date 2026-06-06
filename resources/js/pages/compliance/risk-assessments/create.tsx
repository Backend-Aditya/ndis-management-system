import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import type { Participant } from '@/types/models';

interface Props {
    participants: { data: Participant[] };
}

export default function RiskAssessmentsCreate({ participants }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        participant_id: '',
        risk_area: '',
        risk_description: '',
        likelihood: '',
        impact: '',
        risk_level: '',
        mitigation_strategies: '',
        review_date: '',
    });

    return (
        <>
            <Head title="New Risk Assessment" />
            <div className="max-w-3xl space-y-6 p-6">
                <h1 className="text-2xl font-semibold">New Risk Assessment</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/risk-assessments');
                    }}
                    className="space-y-6"
                >
                    {/* Risk Details */}
                    <div className="space-y-4">
                        <h2 className="text-base font-medium text-muted-foreground">Risk Details</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Participant *</Label>
                                <Select value={data.participant_id} onValueChange={(v) => setData('participant_id', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select participant" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {participants.data.map((p) => (
                                            <SelectItem key={p.id} value={p.id}>
                                                {p.full_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.participant_id} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="risk_area">Risk Area *</Label>
                                <Input
                                    id="risk_area"
                                    value={data.risk_area}
                                    onChange={(e) => setData('risk_area', e.target.value)}
                                    placeholder="e.g. Falls, Medication"
                                />
                                <InputError message={errors.risk_area} />
                            </div>
                            <div className="space-y-2">
                                <Label>Likelihood *</Label>
                                <Select value={data.likelihood} onValueChange={(v) => setData('likelihood', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select likelihood" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="rare">Rare</SelectItem>
                                        <SelectItem value="unlikely">Unlikely</SelectItem>
                                        <SelectItem value="possible">Possible</SelectItem>
                                        <SelectItem value="likely">Likely</SelectItem>
                                        <SelectItem value="almost_certain">Almost Certain</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.likelihood} />
                            </div>
                            <div className="space-y-2">
                                <Label>Impact *</Label>
                                <Select value={data.impact} onValueChange={(v) => setData('impact', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select impact" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="negligible">Negligible</SelectItem>
                                        <SelectItem value="minor">Minor</SelectItem>
                                        <SelectItem value="moderate">Moderate</SelectItem>
                                        <SelectItem value="major">Major</SelectItem>
                                        <SelectItem value="severe">Severe</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.impact} />
                            </div>
                            <div className="space-y-2">
                                <Label>Risk Level *</Label>
                                <Select value={data.risk_level} onValueChange={(v) => setData('risk_level', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select risk level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="extreme">Extreme</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.risk_level} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="review_date">Review Date</Label>
                                <Input
                                    id="review_date"
                                    type="date"
                                    value={data.review_date}
                                    onChange={(e) => setData('review_date', e.target.value)}
                                />
                                <InputError message={errors.review_date} />
                            </div>
                        </div>
                    </div>

                    {/* Description & Mitigation */}
                    <div className="space-y-4">
                        <h2 className="text-base font-medium text-muted-foreground">Description & Mitigation</h2>
                        <div className="space-y-2">
                            <Label htmlFor="risk_description">Risk Description *</Label>
                            <textarea
                                id="risk_description"
                                className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                                rows={4}
                                value={data.risk_description}
                                onChange={(e) => setData('risk_description', e.target.value)}
                            />
                            <InputError message={errors.risk_description} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mitigation_strategies">Mitigation Strategies</Label>
                            <textarea
                                id="mitigation_strategies"
                                className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                                rows={4}
                                value={data.mitigation_strategies}
                                onChange={(e) => setData('mitigation_strategies', e.target.value)}
                            />
                            <InputError message={errors.mitigation_strategies} />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>
                            Save Assessment
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

RiskAssessmentsCreate.layout = (page: React.ReactNode) => <AppLayout children={page} />;
