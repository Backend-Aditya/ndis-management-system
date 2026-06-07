import { Head, router, useForm } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/data-table';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import type { User } from '@/types';
import type { PaginatedResource } from '@/types/models';

interface Props {
    admins: PaginatedResource<User>;
}

export default function PlatformAdminsIndex({ admins }: Props) {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/super-admin/platform-admins', {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    }

    function handleDelete(id: string) {
        if (confirm('Remove this platform admin? Their account will be deleted.')) {
            router.delete(`/super-admin/platform-admins/${id}`);
        }
    }

    const columns: ColumnDef<User>[] = [
        { accessorKey: 'full_name', header: 'Name' },
        { accessorKey: 'email', header: 'Email' },
        {
            id: 'role',
            header: 'Role',
            cell: () => <Badge variant="secondary">Super Admin</Badge>,
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(row.original.id)}
                    className="text-destructive hover:text-destructive"
                >
                    <Trash2 className="size-4" />
                </Button>
            ),
        },
    ];

    return (
        <>
            <Head title="Platform Admins" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Platform Admins</h1>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 size-4" />
                                Add Platform Admin
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Platform Admin</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="first_name">First Name</Label>
                                        <Input
                                            id="first_name"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                        />
                                        <InputError message={errors.first_name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="last_name">Last Name</Label>
                                        <Input
                                            id="last_name"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                        />
                                        <InputError message={errors.last_name} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    <InputError message={errors.email} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <InputError message={errors.password} />
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        Create Admin
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                <DataTable
                    columns={columns}
                    data={admins.data}
                    meta={admins.meta}
                    searchPlaceholder="Search platform admins..."
                />
            </div>
        </>
    );
}

PlatformAdminsIndex.layout = (page: React.ReactNode) => <AppLayout children={page} />;
