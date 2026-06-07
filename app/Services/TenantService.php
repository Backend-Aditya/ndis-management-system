<?php

namespace App\Services;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

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

    /**
     * @param  array<string, mixed>  $data
     * @return array{tenant: Tenant, user: User}
     */
    public function createOrganisation(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $tenant = Tenant::create([
                'name' => $data['name'],
                'slug' => $this->uniqueSlug($data['name']),
                'plan' => $data['plan'],
                'status' => $data['status'],
                'contact_email' => $data['contact_email'],
                'contact_phone' => $data['contact_phone'] ?? null,
                'abn' => $data['abn'] ?? null,
                'ndis_provider_number' => $data['ndis_provider_number'] ?? null,
            ]);

            $user = User::create([
                'tenant_id' => $tenant->id,
                'first_name' => $data['director_first_name'],
                'last_name' => $data['director_last_name'],
                'email' => $data['director_email'],
                'password' => $data['director_password'],
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

    /**
     * Update an organisation and its director account.
     *
     * @param  array<string, mixed>  $data
     */
    public function updateOrganisation(Tenant $tenant, array $data): Tenant
    {
        return DB::transaction(function () use ($tenant, $data) {
            $tenant->update([
                'name' => $data['name'],
                'contact_email' => $data['contact_email'],
                'contact_phone' => $data['contact_phone'] ?? null,
                'plan' => $data['plan'],
                'status' => $data['status'],
                'abn' => $data['abn'] ?? null,
                'ndis_provider_number' => $data['ndis_provider_number'] ?? null,
            ]);

            $director = $tenant->users()->role('director')->first();

            if ($director) {
                $director->update([
                    'first_name' => $data['director_first_name'],
                    'last_name' => $data['director_last_name'],
                    'email' => $data['director_email'],
                ]);

                if (! empty($data['director_password'])) {
                    $director->update(['password' => $data['director_password']]);
                }
            } else {
                // Organisation has no director yet — create one.
                if (empty($data['director_password'])) {
                    throw ValidationException::withMessages([
                        'director_password' => __('A password is required to create the director account.'),
                    ]);
                }

                $director = User::create([
                    'tenant_id' => $tenant->id,
                    'first_name' => $data['director_first_name'],
                    'last_name' => $data['director_last_name'],
                    'email' => $data['director_email'],
                    'password' => $data['director_password'],
                    'is_active' => true,
                    'email_verified_at' => now(),
                ]);

                $director->assignRole('director');
            }

            return $tenant->fresh();
        });
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
