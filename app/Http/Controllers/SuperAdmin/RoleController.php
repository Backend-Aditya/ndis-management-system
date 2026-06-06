<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SuperAdmin\StoreRoleRequest;
use App\Http\Requests\SuperAdmin\UpdateRoleRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index(): Response
    {
        $roles = Role::with('permissions')->withCount('users')->orderBy('name')->get()
            ->map(fn (Role $role) => [
                'id' => $role->id,
                'name' => $role->name,
                'users_count' => $role->users_count,
                'permissions' => $role->permissions->pluck('name'),
            ]);

        $permissions = Permission::orderBy('name')->pluck('name');

        return Inertia::render('super-admin/roles/index', [
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    public function store(StoreRoleRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $role = Role::create(['name' => $data['name'], 'guard_name' => 'web']);
        $role->syncPermissions($data['permissions'] ?? []);

        return back()->with('success', 'Role created.');
    }

    public function update(UpdateRoleRequest $request, Role $role): RedirectResponse
    {
        $data = $request->validated();

        $role->update(['name' => $data['name']]);
        $role->syncPermissions($data['permissions'] ?? []);

        return back()->with('success', 'Role updated.');
    }

    public function destroy(Role $role): RedirectResponse
    {
        // Protect core roles
        if (in_array($role->name, ['super_admin', 'director', 'manager', 'staff_worker'], true)) {
            return back()->with('error', 'Core system roles cannot be deleted.');
        }

        $role->delete();

        return back()->with('success', 'Role deleted.');
    }
}
