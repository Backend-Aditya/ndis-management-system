import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormSection } from '@/components/form/form-section';
import { FormField } from '@/components/form/form-field';
import { FormActions } from '@/components/form/form-actions';

export default function AuditsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        audit_type: '',
        auditor_name: '',
        audit_date: '',
        next_audit_date: '',
        outcome: '',
        status: 'scheduled',
    });

    return (
        <>
            <Head title="Record Audit" />
            <div className="max-w-3xl space-y-6 p-6">
                <h1 className="text-2xl font-semibold">Record Audit</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/audits');
                    }}
                    className="space-y-6"
                >
                    <FormSection title="Audit">
                        <FormField label="Audit Type" error={errors.audit_type} required>
                            <Select value={data.audit_type} onValueChange={(v) => setData('audit_type', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="certification">Certification</SelectItem>
                                    <SelectItem value="verification">Verification</SelectItem>
                                    <SelectItem value="mid_term">Mid-term</SelectItem>
                                    <SelectItem value="practice_standard">Practice Standard</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>
                        <FormField label="Auditor Name" htmlFor="auditor_name" error={errors.auditor_name} required>
                            <Input
                                id="auditor_name"
                                value={data.auditor_name}
                                onChange={(e) => setData('auditor_name', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Audit Date" htmlFor="audit_date" error={errors.audit_date}>
                            <Input
                                id="audit_date"
                                type="date"
                                value={data.audit_date}
                                onChange={(e) => setData('audit_date', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Next Audit Date" htmlFor="next_audit_date" error={errors.next_audit_date}>
                            <Input
                                id="next_audit_date"
                                type="date"
                                value={data.next_audit_date}
                                onChange={(e) => setData('next_audit_date', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Outcome" error={errors.outcome}>
                            <Select value={data.outcome} onValueChange={(v) => setData('outcome', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select outcome (optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pass">Pass</SelectItem>
                                    <SelectItem value="conditional">Conditional</SelectItem>
                                    <SelectItem value="minor_nc">Minor Non-Conformance</SelectItem>
                                    <SelectItem value="major_nc">Major Non-Conformance</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>
                        <FormField label="Status" error={errors.status}>
                            <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="scheduled">Scheduled</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>
                    </FormSection>

                    <FormActions>
                        <Button type="button" variant="outline" onClick={() => history.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Record Audit
                        </Button>
                    </FormActions>
                </form>
            </div>
        </>
    );
}

AuditsCreate.layout = (page: React.ReactNode) => <AppLayout children={page} />;
