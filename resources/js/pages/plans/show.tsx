import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InputError from '@/components/input-error';
import type { NdisPlan } from '@/types/models';

const statusVariant = (status: string) =>
    ({ active: 'default', expired: 'secondary', pending: 'outline' } as const)[
        status as 'active' | 'expired' | 'pending'
    ] ?? 'outline';

const formatCurrency = (value: string | null) =>
    value ? `$${parseFloat(value).toLocaleString('en-AU', { minimumFractionDigits: 2 })}` : '—';

const formatManagementType = (type: string) => type.replace(/_/g, ' ');

function AddCategorySheet({ planId }: { planId: string }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        support_purpose: '',
        category_name: '',
        allocated_amount: '',
        spent_amount: '',
    });

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-1 size-4" />
                    Add Category
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Add Support Category</SheetTitle>
                </SheetHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(`/plans/${planId}/categories`, {
                            onSuccess: () => {
                                setOpen(false);
                                reset();
                            },
                        });
                    }}
                    className="mt-6 space-y-4"
                >
                    <div className="space-y-2">
                        <Label>Support Purpose *</Label>
                        <Select
                            value={data.support_purpose}
                            onValueChange={(v) => setData('support_purpose', v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select purpose" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Core">Core</SelectItem>
                                <SelectItem value="Capacity Building">Capacity Building</SelectItem>
                                <SelectItem value="Capital">Capital</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.support_purpose} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cat_name">Category Name *</Label>
                        <Input
                            id="cat_name"
                            value={data.category_name}
                            onChange={(e) => setData('category_name', e.target.value)}
                        />
                        <InputError message={errors.category_name} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cat_allocated">Allocated Amount ($) *</Label>
                        <Input
                            id="cat_allocated"
                            type="number"
                            step="0.01"
                            value={data.allocated_amount}
                            onChange={(e) => setData('allocated_amount', e.target.value)}
                        />
                        <InputError message={errors.allocated_amount} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cat_spent">Spent Amount ($)</Label>
                        <Input
                            id="cat_spent"
                            type="number"
                            step="0.01"
                            value={data.spent_amount}
                            onChange={(e) => setData('spent_amount', e.target.value)}
                        />
                        <InputError message={errors.spent_amount} />
                    </div>
                    <Button type="submit" disabled={processing} className="w-full">
                        Add Category
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    );
}

function AddManagerSheet({ planId }: { planId: string }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        manager_type: '',
        company_name: '',
        contact_name: '',
        email: '',
        abn: '',
    });

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-1 size-4" />
                    Add Manager
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Add Plan Manager</SheetTitle>
                </SheetHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(`/plans/${planId}/managers`, {
                            onSuccess: () => {
                                setOpen(false);
                                reset();
                            },
                        });
                    }}
                    className="mt-6 space-y-4"
                >
                    <div className="space-y-2">
                        <Label>Manager Type *</Label>
                        <Select
                            value={data.manager_type}
                            onValueChange={(v) => setData('manager_type', v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="plan_manager">Plan Manager</SelectItem>
                                <SelectItem value="support_coordinator">Support Coordinator</SelectItem>
                                <SelectItem value="self">Self</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.manager_type} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mgr_company">Company Name</Label>
                        <Input
                            id="mgr_company"
                            value={data.company_name}
                            onChange={(e) => setData('company_name', e.target.value)}
                        />
                        <InputError message={errors.company_name} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mgr_contact">Contact Name</Label>
                        <Input
                            id="mgr_contact"
                            value={data.contact_name}
                            onChange={(e) => setData('contact_name', e.target.value)}
                        />
                        <InputError message={errors.contact_name} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mgr_email">Email</Label>
                        <Input
                            id="mgr_email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mgr_abn">ABN</Label>
                        <Input
                            id="mgr_abn"
                            value={data.abn}
                            onChange={(e) => setData('abn', e.target.value)}
                        />
                        <InputError message={errors.abn} />
                    </div>
                    <Button type="submit" disabled={processing} className="w-full">
                        Add Manager
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    );
}

export default function PlansShow({ plan }: { plan: NdisPlan }) {
    return (
        <>
            <Head title={plan.plan_number ?? 'Plan'} />
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold">
                            {plan.plan_number ?? 'No Plan Number'}
                        </h1>
                        <div className="text-muted-foreground flex items-center gap-2 text-sm">
                            {plan.participant && <span>{plan.participant.full_name}</span>}
                            <Badge variant={statusVariant(plan.status)}>{plan.status}</Badge>
                        </div>
                        {plan.total_funding && (
                            <p className="text-lg font-medium">{formatCurrency(plan.total_funding)}</p>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="overview">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="categories">
                            Support Categories
                            {plan.support_categories?.length ? ` (${plan.support_categories.length})` : ''}
                        </TabsTrigger>
                        <TabsTrigger value="managers">
                            Plan Managers
                            {plan.managers?.length ? ` (${plan.managers.length})` : ''}
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="mt-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Funding Breakdown</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Core:</span>{' '}
                                        {formatCurrency(plan.core_total)}
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Capacity Building:</span>{' '}
                                        {formatCurrency(plan.capacity_total)}
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Capital:</span>{' '}
                                        {formatCurrency(plan.capital_total)}
                                    </div>
                                    <div className="border-t pt-2 font-medium">
                                        <span className="text-muted-foreground">Total:</span>{' '}
                                        {formatCurrency(plan.total_funding)}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Plan Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Start Date:</span>{' '}
                                        {plan.plan_start_date ?? '—'}
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">End Date:</span>{' '}
                                        {plan.plan_end_date ?? '—'}
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Management Type:</span>{' '}
                                        <span className="capitalize">{formatManagementType(plan.management_type)}</span>
                                    </div>
                                    {(plan.ndia_contact_name || plan.ndia_contact_phone) && (
                                        <div className="border-t pt-2">
                                            <p className="text-muted-foreground mb-1 font-medium">NDIA Contact</p>
                                            {plan.ndia_contact_name && <p>{plan.ndia_contact_name}</p>}
                                            {plan.ndia_contact_phone && <p>{plan.ndia_contact_phone}</p>}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Support Categories Tab */}
                    <TabsContent value="categories" className="mt-4">
                        <div className="space-y-4">
                            <div className="flex justify-end">
                                <AddCategorySheet planId={plan.id} />
                            </div>
                            {(plan.support_categories ?? []).length === 0 ? (
                                <p className="text-muted-foreground text-sm">No support categories added yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {plan.support_categories!.map((cat) => {
                                        const allocated = parseFloat(cat.allocated_amount) || 0;
                                        const spent = parseFloat(cat.spent_amount) || 0;
                                        const progressPct = allocated > 0 ? Math.min((spent / allocated) * 100, 100) : 0;

                                        return (
                                            <Card key={cat.id}>
                                                <CardContent className="space-y-3 pt-4">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <p className="font-medium">{cat.category_name}</p>
                                                            <p className="text-muted-foreground text-xs">
                                                                {cat.support_purpose}
                                                            </p>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                router.delete(
                                                                    `/plans/${plan.id}/categories/${cat.id}`,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="text-destructive size-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="space-y-1 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Allocated</span>
                                                            <span>{formatCurrency(cat.allocated_amount)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Spent</span>
                                                            <span>{formatCurrency(cat.spent_amount)}</span>
                                                        </div>
                                                        <div className="bg-muted mt-2 h-2 rounded-full">
                                                            <div
                                                                className="bg-primary h-2 rounded-full"
                                                                style={{ width: `${progressPct}%` }}
                                                            />
                                                        </div>
                                                        <p className="text-muted-foreground text-right text-xs">
                                                            {progressPct.toFixed(0)}% used
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Plan Managers Tab */}
                    <TabsContent value="managers" className="mt-4">
                        <div className="space-y-4">
                            <div className="flex justify-end">
                                <AddManagerSheet planId={plan.id} />
                            </div>
                            {(plan.managers ?? []).length === 0 ? (
                                <p className="text-muted-foreground text-sm">No plan managers added yet.</p>
                            ) : (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {plan.managers!.map((mgr) => (
                                        <Card key={mgr.id}>
                                            <CardContent className="space-y-1 pt-4 text-sm">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="font-medium capitalize">
                                                            {mgr.manager_type.replace(/_/g, ' ')}
                                                        </p>
                                                        {mgr.company_name && (
                                                            <p className="text-muted-foreground">{mgr.company_name}</p>
                                                        )}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            router.delete(`/plans/${plan.id}/managers/${mgr.id}`)
                                                        }
                                                    >
                                                        <Trash2 className="text-destructive size-4" />
                                                    </Button>
                                                </div>
                                                {mgr.contact_name && <p>{mgr.contact_name}</p>}
                                                {mgr.email && <p>{mgr.email}</p>}
                                                {mgr.abn && (
                                                    <p className="text-muted-foreground">ABN: {mgr.abn}</p>
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

PlansShow.layout = (page: React.ReactNode) => <AppLayout children={page} />;
