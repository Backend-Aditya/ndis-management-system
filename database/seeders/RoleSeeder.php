<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $roles = ['super_admin', 'director', 'manager', 'staff_worker'];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }

        $permissions = [
            'tenant.manage',
            'staff.view', 'staff.create', 'staff.update', 'staff.delete',
            'participant.view', 'participant.create', 'participant.update', 'participant.delete',
            'plan.view', 'plan.create', 'plan.update', 'plan.delete',
            'shift.view', 'shift.create', 'shift.update', 'shift.delete',
            'invoice.view', 'invoice.create', 'invoice.update',
            'incident.view', 'incident.create', 'incident.update',
            'compliance.view',
            'communication.view', 'communication.send',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        Role::findByName('director')->givePermissionTo(Permission::all());

        Role::findByName('manager')->givePermissionTo([
            'staff.view', 'participant.view', 'participant.update',
            'plan.view', 'shift.view', 'shift.create', 'shift.update', 'shift.delete',
            'incident.view', 'incident.create', 'compliance.view',
            'communication.view', 'communication.send',
        ]);

        Role::findByName('staff_worker')->givePermissionTo([
            'participant.view', 'shift.view', 'incident.create', 'communication.view',
        ]);
    }
}
