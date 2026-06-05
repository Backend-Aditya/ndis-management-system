<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::withoutGlobalScopes()->firstOrCreate(
            ['email' => env('SUPER_ADMIN_EMAIL', 'admin@ndis.test')],
            [
                'first_name' => 'Super',
                'last_name' => 'Admin',
                'password' => bcrypt(env('SUPER_ADMIN_PASSWORD', 'password')),
                'tenant_id' => null,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        $admin->assignRole('super_admin');
    }
}
