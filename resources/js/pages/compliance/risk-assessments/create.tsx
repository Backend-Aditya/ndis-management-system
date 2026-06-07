import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormSection } from '@/components/form/form-section';
import { FormField } from '@/components/form/form-field';
import { FormActions } from '@/components/form/form-actions';
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
                    <FormSection title="Assessment">
                        <FormField label="Participant" error={errors.participant_id} required>
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
                        </FormField>
                        <FormField label="Risk Area" htmlFor="risk_area" error={errors.risk_area} required>
                            <Input
                                id="risk_area"
                                value={data.risk_area}
                                onChange={(e) => setData('risk_area', e.target.value)}
                                placeholder="e.g. Falls, Medication"
                            />
                        </FormField>
                        <FormField label="Likelihood" error={errors.likelihood} required>
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
                        </FormField>
                        <FormField label="Impact" error={errors.impact} required>
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
                        </FormField>
                        <FormField label="Risk Level" error={errors.risk_level} required>
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
                        </FormField>
                        <FormField label="Review Date" htmlFor="review_date" error={errors.review_date}>
                            <Input
                                id="review_date"
                                type="date"
                                value={data.review_date}
                                onChange={(e) => setData('review_date', e.target.value)}
                            />
                        </FormField>
                    </FormSection>

                    <FormSection title="Detail">
                        <FormField label="Risk Description" htmlFor="risk_description" error={errors.risk_description} required full>
                            <textarea
                                id="risk_description"
                                className="border-input bg-background min-h-[90px] w-full rounded-md border px-3 py-2 text-sm"
                                value={data.risk_description}
                                onChange={(e) => setData('risk_description', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Mitigation Strategies" htmlFor="mitigation_strategies" error={errors.mitigation_strategies} full>
                            <textarea
                                id="mitigation_strategies"
                                className="border-input bg-background min-h-[90px] w-full rounded-md border px-3 py-2 text-sm"
                                value={data.mitigation_strategies}
                                onChange={(e) => setData('mitigation_strategies', e.target.value)}
                            />
                        </FormField>
                    </FormSection>

                    <FormActions>
                        <Button type="button" variant="outline" onClick={() => history.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Save Assessment
                        </Button>
                    </FormActions>
                </form>
            </div>
        </>
    );
}

RiskAssessmentsCreate.layout = (page: React.ReactNode) => <AppLayout children={page} />;
