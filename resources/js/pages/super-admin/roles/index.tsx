import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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

interface RoleRow {
    id: number;
    name: string;
    users_count: number;
    permissions: string[];
}

interface Props {
    roles: RoleRow[];
    permissions: string[];
}

const CORE = ['super_admin', 'director', 'manager', 'staff_worker'];

interface PermissionGridProps {
    allPermissions: string[];
    selected: string[];
    onChange: (permissions: string[]) => void;
}

function PermissionGrid({ allPermissions, selected, onChange }: PermissionGridProps) {
    function toggle(perm: string) {
        if (selected.includes(perm)) {
            onChange(selected.filter((p) => p !== perm));
        } else {
            onChange([...selected, perm]);
        }
    }

    return (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 max-h-64 overflow-y-auto pr-1">
            {allPermissions.map((perm) => (
                <div key={perm} className="flex items-center gap-2">
                    <Checkbox
                        id={`perm-${perm}`}
                        checked={selected.includes(perm)}
                        onCheckedChange={() => toggle(perm)}
                    />
                    <Label htmlFor={`perm-${perm}`} className="text-xs font-normal cursor-pointer">
                        {perm}
                    </Label>
                </div>
            ))}
        </div>
    );
}

interface NewRoleDialogProps {
    permissions: string[];
}

function NewRoleDialog({ permissions }: NewRoleDialogProps) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<{
        name: string;
        permissions: string[];
    }>({
        name: '',
        permissions: [],
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/super-admin/roles', {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-2 size-4" />
                    New Role
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>New Role</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="role-name">Role Name</Label>
                        <Input
                            id="role-name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. coordinator"
                        />
                        <InputError message={errors.name} />
                    </div>
                    {permissions.length > 0 && (
                        <div className="space-y-2">
                            <Label>Permissions</Label>
                            <PermissionGrid
                                allPermissions={permissions}
                                selected={data.permissions}
                                onChange={(p) => setData('permissions', p)}
                            />
                        </div>
                    )}
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Create Role
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

interface EditRoleDialogProps {
    role: RoleRow;
    permissions: string[];
}

function EditRoleDialog({ role, permissions }: EditRoleDialogProps) {
    const [open, setOpen] = useState(false);
    const { data, setData, put, processing, errors, reset } = useForm<{
        name: string;
        permissions: string[];
    }>({
        name: role.name,
        permissions: role.permissions,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/super-admin/roles/${role.id}`, {
            onSuccess: () => {
                setOpen(false);
            },
        });
    }

    function handleOpenChange(val: boolean) {
        setOpen(val);
        if (val) {
            reset();
            setData({ name: role.name, permissions: role.permissions });
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Pencil className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Role: {role.name}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor={`edit-role-name-${role.id}`}>Role Name</Label>
                        <Input
                            id={`edit-role-name-${role.id}`}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} />
                    </div>
                    {permissions.length > 0 && (
                        <div className="space-y-2">
                            <Label>Permissions</Label>
                            <PermissionGrid
                                allPermissions={permissions}
                                selected={data.permissions}
                                onChange={(p) => setData('permissions', p)}
                            />
                        </div>
                    )}
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

interface NewPermissionDialogProps {}

function NewPermissionDialog(_: NewPermissionDialogProps) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/super-admin/permissions', {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-2 size-4" />
                    New Permission
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Permission</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="permission-name">Permission Name</Label>
                        <Input
                            id="permission-name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. manage_participants"
                        />
                        <InputError message={errors.name} />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Create Permission
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function RolesIndex({ roles, permissions }: Props) {
    function handleDeleteRole(role: RoleRow) {
        if (confirm(`Delete role "${role.name}"? This cannot be undone.`)) {
            router.delete(`/super-admin/roles/${role.id}`);
        }
    }

    return (
        <>
            <Head title="Roles & Permissions" />
            <div className="space-y-8 p-6">
                {/* Roles Section */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle>Roles</CardTitle>
                        <NewRoleDialog permissions={permissions} />
                    </CardHeader>
                    <CardContent>
                        {roles.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No roles defined yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {roles.map((role) => {
                                    const isCore = CORE.includes(role.name);
                                    return (
                                        <div
                                            key={role.id}
                                            className="flex items-center justify-between rounded-lg border p-4"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{role.name}</span>
                                                    {isCore && (
                                                        <Badge variant="outline" className="text-xs">
                                                            core
                                                        </Badge>
                                                    )}
                                                    <Badge variant="secondary" className="text-xs">
                                                        {role.users_count} {role.users_count === 1 ? 'user' : 'users'}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    {role.permissions.length === 0
                                                        ? 'No permissions assigned'
                                                        : `${role.permissions.length} permission${role.permissions.length === 1 ? '' : 's'}`}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <EditRoleDialog role={role} permissions={permissions} />
                                                {!isCore && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDeleteRole(role)}
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Permissions Section */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle>Permissions</CardTitle>
                        <NewPermissionDialog />
                    </CardHeader>
                    <CardContent>
                        {permissions.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No permissions defined yet.</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {permissions.map((perm) => (
                                    <Badge key={perm} variant="outline">
                                        {perm}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

RolesIndex.layout = (page: React.ReactNode) => <AppLayout children={page} />;
