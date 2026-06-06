import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';

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
                    {/* Audit Details */}
                    <div className="space-y-4">
                        <h2 className="text-base font-medium text-muted-foreground">Audit Details</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Audit Type *</Label>
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
                                <InputError message={errors.audit_type} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="auditor_name">Auditor Name *</Label>
                                <Input
                                    id="auditor_name"
                                    value={data.auditor_name}
                                    onChange={(e) => setData('auditor_name', e.target.value)}
                                />
                                <InputError message={errors.auditor_name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="audit_date">Audit Date</Label>
                                <Input
                                    id="audit_date"
                                    type="date"
                                    value={data.audit_date}
                                    onChange={(e) => setData('audit_date', e.target.value)}
                                />
                                <InputError message={errors.audit_date} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="next_audit_date">Next Audit Date</Label>
                                <Input
                                    id="next_audit_date"
                                    type="date"
                                    value={data.next_audit_date}
                                    onChange={(e) => setData('next_audit_date', e.target.value)}
                                />
                                <InputError message={errors.next_audit_date} />
                            </div>
                            <div className="space-y-2">
                                <Label>Outcome</Label>
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
                                <InputError message={errors.outcome} />
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
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
                                <InputError message={errors.status} />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>
                            Record Audit
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

AuditsCreate.layout = (page: React.ReactNode) => <AppLayout children={page} />;
