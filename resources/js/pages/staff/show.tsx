import { Head, Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { StaffProfile, User } from '@/types/models';

interface StaffWithProfile extends User {
    staff_profile: StaffProfile | null;
}

export default function StaffShow({ staff }: { staff: StaffWithProfile }) {
    return (
        <>
            <Head title={staff.full_name} />
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold">{staff.full_name}</h1>
                        <div className="flex gap-2">
                            <Badge variant="outline">{staff.roles[0]?.replace('_', ' ')}</Badge>
                            <Badge variant={staff.is_active ? 'default' : 'secondary'}>
                                {staff.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={`/staff/${staff.id}/edit`}><Pencil className="size-4 mr-2" />Edit</Link>
                    </Button>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div><span className="text-muted-foreground">Email:</span> {staff.email}</div>
                            <div><span className="text-muted-foreground">Phone:</span> {staff.phone ?? '—'}</div>
                        </CardContent>
                    </Card>
                    {staff.staff_profile && (
                        <Card>
                            <CardHeader><CardTitle>Employment</CardTitle></CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div><span className="text-muted-foreground">Employee #:</span> {staff.staff_profile.employee_number ?? '—'}</div>
                                <div><span className="text-muted-foreground">Position:</span> {staff.staff_profile.position ?? '—'}</div>
                                <div><span className="text-muted-foreground">Department:</span> {staff.staff_profile.department ?? '—'}</div>
                                <div><span className="text-muted-foreground">Type:</span> {staff.staff_profile.employment_type ?? '—'}</div>
                                <div><span className="text-muted-foreground">Start:</span> {staff.staff_profile.employment_start ?? '—'}</div>
                                <div><span className="text-muted-foreground">Hourly Rate:</span> {staff.staff_profile.hourly_rate ? `$${staff.staff_profile.hourly_rate}` : '—'}</div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}
StaffShow.layout = (page: React.ReactNode) => <AppLayout children={page} />;
