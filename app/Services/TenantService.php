<?php

namespace App\Services;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TenantService
{
    /**
     * @param  array{organisation_name: string, first_name: string, last_name: string, email: string, password: string}  $data
     * @return array{tenant: Tenant, user: User}
     */
    public function createWithDirector(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $tenant = Tenant::create([
                'name' => $data['organisation_name'],
                'slug' => $this->uniqueSlug($data['organisation_name']),
                'plan' => 'starter',
                'status' => 'trialing',
                'contact_email' => $data['email'],
                'trial_ends_at' => now()->addDays(14),
            ]);

            $user = User::create([
                'tenant_id' => $tenant->id,
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'],
                'password' => $data['password'],
                'is_active' => true,
                'email_verified_at' => now(),
            ]);

            $user->assignRole('director');

            return compact('tenant', 'user');
        });
    }

    private function uniqueSlug(string $name): string
    {
        $slug = Str::slug($name);
        $count = Tenant::withoutGlobalScopes()->where('slug', 'like', $slug.'%')->count();

        return $count > 0 ? "{$slug}-{$count}" : $slug;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Tenant $tenant, array $data): Tenant
    {
        $tenant->update($data);

        return $tenant->fresh();
    }

    public function suspend(Tenant $tenant): Tenant
    {
        $tenant->update(['status' => 'suspended']);

        return $tenant;
    }

    public function activate(Tenant $tenant): Tenant
    {
        $tenant->update(['status' => 'active']);

        return $tenant;
    }
}
