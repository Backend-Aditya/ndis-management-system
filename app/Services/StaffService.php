<?php

namespace App\Services;

use App\Models\StaffProfile;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class StaffService
{
    public function create(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'tenant_id' => app('tenant')->id,
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'],
                'password' => $data['password'],
                'phone' => $data['phone'] ?? null,
                'is_active' => true,
            ]);

            $user->assignRole($data['role'] ?? 'staff_worker');

            StaffProfile::create([
                'user_id' => $user->id,
                'tenant_id' => app('tenant')->id,
                'position' => $data['position'] ?? null,
                'department' => $data['department'] ?? null,
                'employment_type' => $data['employment_type'] ?? null,
                'employment_start' => $data['employment_start'] ?? null,
                'hourly_rate' => $data['hourly_rate'] ?? null,
                'kms_rate' => $data['kms_rate'] ?? null,
                'employee_number' => $data['employee_number'] ?? null,
            ]);

            return $user->load('staffProfile');
        });
    }

    public function update(User $user, array $data): User
    {
        return DB::transaction(function () use ($user, $data) {
            $user->update([
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'is_active' => $data['is_active'] ?? true,
            ]);

            if (isset($data['role'])) {
                $user->syncRoles([$data['role']]);
            }

            $user->staffProfile?->update([
                'position' => $data['position'] ?? null,
                'department' => $data['department'] ?? null,
                'employment_type' => $data['employment_type'] ?? null,
                'employment_start' => $data['employment_start'] ?? null,
                'hourly_rate' => $data['hourly_rate'] ?? null,
                'kms_rate' => $data['kms_rate'] ?? null,
            ]);

            return $user->fresh(['staffProfile']);
        });
    }

    public function deactivate(User $user): User
    {
        $user->update(['is_active' => false]);

        return $user;
    }
}
