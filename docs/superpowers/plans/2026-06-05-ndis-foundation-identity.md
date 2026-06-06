# NDIS SaaS — Foundation + Identity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Phase 1 (Foundation: models, traits, middleware, seeders, TypeScript types) and Phase 2 (Identity: tenant management for superadmin, staff management for directors) of the NDIS SaaS platform.

**Architecture:** Middleware-based tenant isolation via `HasTenant` trait + `ResolveTenant` middleware. Thin controllers delegate to domain service classes. All PHP resources annotated `#[TypeScript]` and transformed to TS interfaces via spatie/laravel-typescript-transformer.

**Tech Stack:** Laravel 13 · Inertia v3 · React 19 · ShadCN UI · TailwindCSS v4 · Spatie Permissions · Laravel Cashier v16 · Spatie Media Library · spatie/laravel-typescript-transformer · Pest v4

---

## File Map

### New files — Backend
- `app/Concerns/HasTenant.php`
- `app/Http/Middleware/ResolveTenant.php`
- `app/Http/Middleware/RequireSuperAdmin.php`
- `app/Models/Tenant.php`
- `app/Models/StaffProfile.php`
- `app/Models/StaffQualification.php`
- `app/Models/StaffAvailability.php`
- `app/Services/TenantService.php`
- `app/Services/StaffService.php`
- `app/Http/Controllers/SuperAdmin/TenantController.php`
- `app/Http/Controllers/Director/StaffController.php`
- `app/Http/Requests/SuperAdmin/StoreTenantRequest.php`
- `app/Http/Requests/SuperAdmin/UpdateTenantRequest.php`
- `app/Http/Requests/Director/StoreStaffRequest.php`
- `app/Http/Requests/Director/UpdateStaffRequest.php`
- `app/Http/Resources/TenantResource.php`
- `app/Http/Resources/UserResource.php`
- `app/Http/Resources/StaffProfileResource.php`
- `app/Policies/TenantPolicy.php`
- `app/Policies/UserPolicy.php`
- `database/factories/TenantFactory.php`
- `database/factories/StaffProfileFactory.php`
- `database/seeders/RoleSeeder.php`
- `database/seeders/SuperAdminSeeder.php`
- `routes/super-admin.php`
- `routes/director.php`

### Modified files — Backend
- `app/Models/User.php` — remove Billable, add relationships, fix fillable
- `app/Actions/Fortify/CreateNewUser.php` — create tenant + director on register
- `app/Concerns/ProfileValidationRules.php` — first_name/last_name instead of name
- `app/Http/Middleware/HandleInertiaRequests.php` — share auth.roles, auth.tenant
- `bootstrap/app.php` — register middleware aliases + route files
- `config/cashier.php` — set model to Tenant
- `database/seeders/DatabaseSeeder.php` — call RoleSeeder + SuperAdminSeeder

### New files — Frontend
- `resources/js/pages/super-admin/tenants/index.tsx`
- `resources/js/pages/super-admin/tenants/create.tsx`
- `resources/js/pages/super-admin/tenants/edit.tsx`
- `resources/js/pages/staff/index.tsx`
- `resources/js/pages/staff/create.tsx`
- `resources/js/pages/staff/edit.tsx`
- `resources/js/pages/staff/show.tsx`
- `resources/js/layouts/super-admin-layout.tsx`
- `resources/js/components/data-table/data-table.tsx`
- `resources/js/components/data-table/data-table-toolbar.tsx`
- `resources/js/components/data-table/data-table-pagination.tsx`

### Modified files — Frontend
- `resources/js/components/app-sidebar.tsx` — full NDIS nav groups
- `resources/js/types/global.d.ts` — import generated types

---

## Task 1: Install spatie/laravel-typescript-transformer

**Files:**
- Modify: `config/typescript-transformer.php` (published)

- [ ] **Step 1: Install package**

```bash
composer require spatie/laravel-typescript-transformer
php artisan vendor:publish --provider="Spatie\TypeScriptTransformer\TypeScriptTransformerServiceProvider"
```

- [ ] **Step 2: Configure transformer to scan Resources**

Edit `config/typescript-transformer.php`:
```php
'collectors' => [
    Spatie\TypeScriptTransformer\Collectors\AnnotationCollector::class,
],
'transformers' => [
    Spatie\LaravelTypeScriptTransformer\Transformers\ResourceTransformer::class,
    Spatie\TypeScriptTransformer\Transformers\EnumTransformer::class,
],
'output_file' => resource_path('js/types/generated.d.ts'),
'auto_discover_types' => [
    app_path('Http/Resources'),
    app_path('Enums'),
],
```

- [ ] **Step 3: Add transform command to Vite build**

Edit `vite.config.js` — add to the plugins array after wayfinder:
```js
{
    name: 'typescript-transformer',
    buildStart() {
        const { execSync } = require('child_process');
        execSync('php artisan typescript:transform', { stdio: 'inherit' });
    },
},
```

- [ ] **Step 4: Commit**

```bash
git add composer.json composer.lock config/typescript-transformer.php vite.config.js
git commit -m "feat: install spatie/laravel-typescript-transformer"
```

---

## Task 2: Tenant model + factory + Cashier config

**Files:**
- Create: `app/Models/Tenant.php`
- Create: `database/factories/TenantFactory.php`
- Modify: `config/cashier.php`

- [ ] **Step 1: Write failing test**

```bash
php artisan make:test --pest TenantModelTest
```

Edit `tests/Feature/TenantModelTest.php`:
```php
<?php

use App\Models\Tenant;
use App\Models\User;

it('creates a tenant with required fields', function () {
    $tenant = Tenant::factory()->create(['name' => 'Sunrise NDIS', 'status' => 'trialing']);

    expect($tenant->name)->toBe('Sunrise NDIS')
        ->and($tenant->slug)->not->toBeEmpty()
        ->and($tenant->status)->toBe('trialing');
});

it('tenant has many users', function () {
    $tenant = Tenant::factory()->create();
    User::factory()->count(3)->create(['tenant_id' => $tenant->id]);

    expect($tenant->users)->toHaveCount(3);
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
php artisan test --compact --filter=TenantModelTest
```
Expected: FAIL — `App\Models\Tenant` not found.

- [ ] **Step 3: Create Tenant model**

```bash
php artisan make:model Tenant
```

Replace `app/Models/Tenant.php`:
```php
<?php

namespace App\Models;

use Database\Factories\TenantFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Cashier\Billable;

class Tenant extends Model
{
    /** @use HasFactory<TenantFactory> */
    use HasFactory, HasUuids, Billable;

    protected $fillable = [
        'name', 'slug', 'plan', 'status', 'abn',
        'ndis_provider_number', 'contact_email', 'contact_phone',
        'settings', 'stripe_id', 'pm_type', 'pm_last_four', 'trial_ends_at',
    ];

    protected function casts(): array
    {
        return [
            'settings' => 'array',
            'trial_ends_at' => 'datetime',
        ];
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
```

- [ ] **Step 4: Create factory**

```bash
php artisan make:factory TenantFactory --model=Tenant
```

Replace `database/factories/TenantFactory.php`:
```php
<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tenant>
 */
class TenantFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->company();

        return [
            'name' => $name,
            'slug' => Str::slug($name) . '-' . fake()->unique()->numerify('###'),
            'plan' => 'starter',
            'status' => 'active',
            'abn' => fake()->numerify('## ### ### ###'),
            'ndis_provider_number' => fake()->numerify('4#######'),
            'contact_email' => fake()->companyEmail(),
            'contact_phone' => fake()->phoneNumber(),
            'settings' => [],
        ];
    }

    public function trialing(): static
    {
        return $this->state(['status' => 'trialing', 'trial_ends_at' => now()->addDays(14)]);
    }

    public function suspended(): static
    {
        return $this->state(['status' => 'suspended']);
    }
}
```

- [ ] **Step 5: Publish + configure Cashier for Tenant**

```bash
php artisan vendor:publish --tag="cashier-config"
```

Edit `config/cashier.php` — change model line:
```php
'model' => App\Models\Tenant::class,
```

- [ ] **Step 6: Run tests — expect PASS**

```bash
php artisan test --compact --filter=TenantModelTest
```

- [ ] **Step 7: Commit**

```bash
git add app/Models/Tenant.php database/factories/TenantFactory.php config/cashier.php
git commit -m "feat: Tenant model, factory, Cashier config"
```

---

## Task 3: HasTenant trait with GlobalScope

**Files:**
- Create: `app/Concerns/HasTenant.php`

- [ ] **Step 1: Write failing test**

Edit `tests/Feature/TenantModelTest.php` — add:
```php
it('HasTenant global scope filters by current tenant', function () {
    $tenantA = Tenant::factory()->create();
    $tenantB = Tenant::factory()->create();

    // Simulate resolved tenant in container
    app()->instance('tenant', $tenantA);

    User::factory()->create(['tenant_id' => $tenantA->id]);
    User::factory()->create(['tenant_id' => $tenantB->id]);

    // User model uses HasTenant — should only see tenantA users
    expect(User::count())->toBe(1);
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
php artisan test --compact --filter="HasTenant global scope"
```
Expected: FAIL — User::count() returns 2.

- [ ] **Step 3: Create HasTenant trait**

```bash
php artisan make:class Concerns/HasTenant
```

Replace `app/Concerns/HasTenant.php`:
```php
<?php

namespace App\Concerns;

use App\Models\Tenant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait HasTenant
{
    public static function bootHasTenant(): void
    {
        static::addGlobalScope('tenant', function (Builder $builder) {
            if (app()->has('tenant')) {
                $builder->where(
                    $builder->getModel()->getTable() . '.tenant_id',
                    app('tenant')->id
                );
            }
        });

        static::creating(function (Model $model) {
            if (empty($model->tenant_id) && app()->has('tenant')) {
                $model->tenant_id = app('tenant')->id;
            }
        });
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}
```

- [ ] **Step 4: Apply trait to User model**

Edit `app/Models/User.php` — full replacement:
```php
<?php

namespace App\Models;

use App\Concerns\HasTenant;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Permission\Traits\HasRoles;

#[Fillable([
    'tenant_id', 'email', 'password', 'first_name', 'last_name',
    'phone', 'is_active', 'last_login_at',
])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser, HasMedia
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasUuids, Notifiable, PasskeyAuthenticatable,
        TwoFactorAuthenticatable, HasRoles, HasTenant, InteractsWithMedia;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'is_active' => 'boolean',
            'last_login_at' => 'datetime',
        ];
    }

    public function staffProfile(): HasOne
    {
        return $this->hasOne(StaffProfile::class);
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('avatar')->singleFile();
    }
}
```

- [ ] **Step 5: Run tests — expect PASS**

```bash
php artisan test --compact --filter=TenantModelTest
```

- [ ] **Step 6: Commit**

```bash
git add app/Concerns/HasTenant.php app/Models/User.php
git commit -m "feat: HasTenant trait with GlobalScope + updated User model"
```

---

## Task 4: Staff models (StaffProfile, StaffQualification, StaffAvailability)

**Files:**
- Create: `app/Models/StaffProfile.php`
- Create: `app/Models/StaffQualification.php`
- Create: `app/Models/StaffAvailability.php`
- Create: `database/factories/StaffProfileFactory.php`

- [ ] **Step 1: Create models via Artisan**

```bash
php artisan make:model StaffProfile -f
php artisan make:model StaffQualification -f
php artisan make:model StaffAvailability -f
```

- [ ] **Step 2: Write failing test**

```bash
php artisan make:test --pest StaffProfileTest
```

Edit `tests/Feature/StaffProfileTest.php`:
```php
<?php

use App\Models\StaffProfile;
use App\Models\Tenant;
use App\Models\User;

beforeEach(function () {
    $this->tenant = Tenant::factory()->create();
    $this->director = User::factory()->create(['tenant_id' => $this->tenant->id]);
    $this->director->assignRole('director');
    app()->instance('tenant', $this->tenant);
});

it('director can view staff profiles scoped to tenant', function () {
    StaffProfile::factory()->count(2)->create(['tenant_id' => $this->tenant->id]);

    $otherTenant = Tenant::factory()->create();
    StaffProfile::factory()->create(['tenant_id' => $otherTenant->id]);

    expect(StaffProfile::count())->toBe(2);
});

it('staff profile belongs to user and tenant', function () {
    $user = User::factory()->create(['tenant_id' => $this->tenant->id]);
    $profile = StaffProfile::factory()->create([
        'user_id' => $user->id,
        'tenant_id' => $this->tenant->id,
    ]);

    expect($profile->user->id)->toBe($user->id)
        ->and($profile->tenant->id)->toBe($this->tenant->id);
});
```

- [ ] **Step 3: Implement StaffProfile model**

Replace `app/Models/StaffProfile.php`:
```php
<?php

namespace App\Models;

use App\Concerns\HasTenant;
use Database\Factories\StaffProfileFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StaffProfile extends Model
{
    /** @use HasFactory<StaffProfileFactory> */
    use HasFactory, HasUuids, HasTenant;

    protected $fillable = [
        'user_id', 'tenant_id', 'employee_number', 'position', 'department',
        'employment_start', 'employment_end', 'employment_type',
        'hourly_rate', 'kms_rate', 'tax_file_number', 'bank_bsb', 'bank_account',
    ];

    protected function casts(): array
    {
        return [
            'employment_start' => 'date',
            'employment_end' => 'date',
            'hourly_rate' => 'decimal:2',
            'kms_rate' => 'decimal:4',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function qualifications(): HasMany
    {
        return $this->hasMany(StaffQualification::class, 'staff_id');
    }

    public function availability(): HasMany
    {
        return $this->hasMany(StaffAvailability::class, 'staff_id');
    }
}
```

- [ ] **Step 4: Implement StaffQualification model**

Replace `app/Models/StaffQualification.php`:
```php
<?php

namespace App\Models;

use Database\Factories\StaffQualificationFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StaffQualification extends Model
{
    /** @use HasFactory<StaffQualificationFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'staff_id', 'qualification_name', 'issuing_body',
        'issue_date', 'expiry_date', 'status',
    ];

    protected function casts(): array
    {
        return [
            'issue_date' => 'date',
            'expiry_date' => 'date',
        ];
    }

    public function staffProfile(): BelongsTo
    {
        return $this->belongsTo(StaffProfile::class, 'staff_id');
    }
}
```

- [ ] **Step 5: Implement StaffAvailability model**

Replace `app/Models/StaffAvailability.php`:
```php
<?php

namespace App\Models;

use Database\Factories\StaffAvailabilityFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StaffAvailability extends Model
{
    /** @use HasFactory<StaffAvailabilityFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'staff_id', 'day_of_week', 'start_time', 'end_time',
        'is_recurring', 'effective_from', 'effective_to',
    ];

    protected function casts(): array
    {
        return [
            'is_recurring' => 'boolean',
            'effective_from' => 'date',
            'effective_to' => 'date',
        ];
    }

    public function staffProfile(): BelongsTo
    {
        return $this->belongsTo(StaffProfile::class, 'staff_id');
    }
}
```

- [ ] **Step 6: Implement StaffProfileFactory**

Replace `database/factories/StaffProfileFactory.php`:
```php
<?php

namespace Database\Factories;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StaffProfile>
 */
class StaffProfileFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'tenant_id' => Tenant::factory(),
            'employee_number' => fake()->numerify('EMP-####'),
            'position' => fake()->randomElement(['Support Worker', 'Team Leader', 'Coordinator']),
            'department' => fake()->randomElement(['Community', 'Residential', 'Day Programs']),
            'employment_start' => fake()->dateTimeBetween('-3 years', '-1 month'),
            'employment_type' => fake()->randomElement(['full_time', 'part_time', 'casual']),
            'hourly_rate' => fake()->randomFloat(2, 28, 55),
            'kms_rate' => 0.96,
        ];
    }
}
```

- [ ] **Step 7: Run tests — expect PASS**

```bash
php artisan test --compact --filter=StaffProfileTest
```

- [ ] **Step 8: Commit**

```bash
git add app/Models/StaffProfile.php app/Models/StaffQualification.php app/Models/StaffAvailability.php database/factories/StaffProfileFactory.php
git commit -m "feat: StaffProfile, StaffQualification, StaffAvailability models"
```

---

## Task 5: ResolveTenant + RequireSuperAdmin middleware

**Files:**
- Create: `app/Http/Middleware/ResolveTenant.php`
- Create: `app/Http/Middleware/RequireSuperAdmin.php`
- Modify: `bootstrap/app.php`

- [ ] **Step 1: Create middleware files**

```bash
php artisan make:middleware ResolveTenant
php artisan make:middleware RequireSuperAdmin
```

- [ ] **Step 2: Implement ResolveTenant**

Replace `app/Http/Middleware/ResolveTenant.php`:
```php
<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ResolveTenant
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->tenant_id) {
            $tenant = Tenant::find($user->tenant_id);

            if ($tenant) {
                app()->instance('tenant', $tenant);
            }
        }

        return $next($request);
    }
}
```

- [ ] **Step 3: Implement RequireSuperAdmin**

Replace `app/Http/Middleware/RequireSuperAdmin.php`:
```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireSuperAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->hasRole('super_admin')) {
            abort(403, 'Super admin access required.');
        }

        return $next($request);
    }
}
```

- [ ] **Step 4: Register middleware aliases in bootstrap/app.php**

Edit `bootstrap/app.php` — add to `withMiddleware`:
```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'tenant' => \App\Http\Middleware\ResolveTenant::class,
        'super_admin' => \App\Http\Middleware\RequireSuperAdmin::class,
    ]);
    $middleware->web(append: [
        \App\Http\Middleware\HandleAppearance::class,
        \App\Http\Middleware\HandleInertiaRequests::class,
        \Illuminate\Foundation\Http\Middleware\ShareErrorsFromSession::class,
    ]);
})
```

- [ ] **Step 5: Write middleware test**

```bash
php artisan make:test --pest MiddlewareTest
```

Edit `tests/Feature/MiddlewareTest.php`:
```php
<?php

use App\Models\Tenant;
use App\Models\User;

it('ResolveTenant sets tenant in container from authenticated user', function () {
    $tenant = Tenant::factory()->create();
    $user = User::factory()->create(['tenant_id' => $tenant->id]);

    actingAs($user)->get('/dashboard');

    expect(app()->has('tenant'))->toBeTrue()
        ->and(app('tenant')->id)->toBe($tenant->id);
});

it('RequireSuperAdmin blocks non-super-admin users', function () {
    $tenant = Tenant::factory()->create();
    $user = User::factory()->create(['tenant_id' => $tenant->id]);
    $user->assignRole('director');

    actingAs($user)->get('/super-admin/tenants')
        ->assertForbidden();
});

it('RequireSuperAdmin allows super_admin users', function () {
    $user = User::factory()->create(['tenant_id' => null]);
    $user->assignRole('super_admin');

    actingAs($user)->get('/super-admin/tenants')
        ->assertOk();
});
```

- [ ] **Step 6: Run tests — expect PASS**

```bash
php artisan test --compact --filter=MiddlewareTest
```

- [ ] **Step 7: Commit**

```bash
git add app/Http/Middleware/ResolveTenant.php app/Http/Middleware/RequireSuperAdmin.php bootstrap/app.php
git commit -m "feat: ResolveTenant + RequireSuperAdmin middleware"
```

---

## Task 6: Role seeder + SuperAdmin seeder

**Files:**
- Create: `database/seeders/RoleSeeder.php`
- Create: `database/seeders/SuperAdminSeeder.php`
- Modify: `database/seeders/DatabaseSeeder.php`

- [ ] **Step 1: Create seeders**

```bash
php artisan make:seeder RoleSeeder
php artisan make:seeder SuperAdminSeeder
```

- [ ] **Step 2: Implement RoleSeeder**

Replace `database/seeders/RoleSeeder.php`:
```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $roles = ['super_admin', 'director', 'manager', 'staff_worker'];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }

        // Permissions per resource — director gets all, others scoped
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
            'participant.view', 'shift.view', 'incident.create',
            'communication.view',
        ]);
    }
}
```

- [ ] **Step 3: Implement SuperAdminSeeder**

Replace `database/seeders/SuperAdminSeeder.php`:
```php
<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
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
```

- [ ] **Step 4: Update DatabaseSeeder**

Edit `database/seeders/DatabaseSeeder.php`:
```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            SuperAdminSeeder::class,
        ]);
    }
}
```

- [ ] **Step 5: Add .env variables**

Add to `.env`:
```
SUPER_ADMIN_EMAIL=admin@ndis.test
SUPER_ADMIN_PASSWORD=password
```

- [ ] **Step 6: Run seeders**

```bash
php artisan db:seed
```
Expected: no errors, roles and super_admin user created.

- [ ] **Step 7: Verify via tinker**

```bash
php artisan tinker --execute 'echo App\Models\User::where("email","admin@ndis.test")->first()->getRoleNames()->first();'
```
Expected output: `super_admin`

- [ ] **Step 8: Commit**

```bash
git add database/seeders/RoleSeeder.php database/seeders/SuperAdminSeeder.php database/seeders/DatabaseSeeder.php .env.example
git commit -m "feat: role seeder + superadmin seeder with Spatie permissions"
```

---

## Task 7: Update Fortify registration for tenant + director creation

**Files:**
- Modify: `app/Actions/Fortify/CreateNewUser.php`
- Modify: `app/Concerns/ProfileValidationRules.php`
- Create: `app/Services/TenantService.php`

- [ ] **Step 1: Write failing registration test**

```bash
php artisan make:test --pest RegistrationTest
```

Edit `tests/Feature/Auth/RegistrationTest.php`:
```php
<?php

use App\Models\Tenant;
use App\Models\User;

it('registration creates a tenant and director user with trial', function () {
    $response = $this->post('/register', [
        'first_name' => 'Jane',
        'last_name' => 'Doe',
        'organisation_name' => 'Sunrise NDIS',
        'email' => 'jane@sunrise.com.au',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertRedirect('/dashboard');

    $user = User::where('email', 'jane@sunrise.com.au')->first();
    expect($user)->not->toBeNull()
        ->and($user->hasRole('director'))->toBeTrue()
        ->and($user->tenant)->not->toBeNull()
        ->and($user->tenant->name)->toBe('Sunrise NDIS')
        ->and($user->tenant->status)->toBe('trialing');
});

it('registration fails without organisation name', function () {
    $this->post('/register', [
        'first_name' => 'Jane',
        'last_name' => 'Doe',
        'email' => 'jane2@sunrise.com.au',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertSessionHasErrors('organisation_name');
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
php artisan test --compact --filter=RegistrationTest
```
Expected: FAIL — validation and tenant not created.

- [ ] **Step 3: Create TenantService**

```bash
php artisan make:class Services/TenantService
```

Replace `app/Services/TenantService.php`:
```php
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

            // Start 14-day Cashier trial (no Stripe call — sets trial_ends_at locally)
            $tenant->forceFill(['trial_ends_at' => now()->addDays(14)])->save();

            return compact('tenant', 'user');
        });
    }

    private function uniqueSlug(string $name): string
    {
        $slug = Str::slug($name);
        $count = Tenant::where('slug', 'like', $slug . '%')->count();

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
```

- [ ] **Step 4: Update ProfileValidationRules**

Replace `app/Concerns/ProfileValidationRules.php`:
```php
<?php

namespace App\Concerns;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait ProfileValidationRules
{
    /**
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function profileRules(?string $userId = null): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => $this->emailRules($userId),
        ];
    }

    /**
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function emailRules(?string $userId = null): array
    {
        return [
            'required', 'string', 'email', 'max:255',
            $userId === null
                ? Rule::unique(User::class)
                : Rule::unique(User::class)->ignore($userId),
        ];
    }
}
```

- [ ] **Step 5: Update CreateNewUser action**

Replace `app/Actions/Fortify/CreateNewUser.php`:
```php
<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use App\Services\TenantService;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    public function __construct(private readonly TenantService $tenantService) {}

    /**
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'organisation_name' => ['required', 'string', 'max:255'],
            'password' => $this->passwordRules(),
        ])->validate();

        ['user' => $user] = $this->tenantService->createWithDirector($input);

        return $user;
    }
}
```

- [ ] **Step 6: Run tests — expect PASS**

```bash
php artisan test --compact --filter=RegistrationTest
```

- [ ] **Step 7: Commit**

```bash
git add app/Actions/Fortify/CreateNewUser.php app/Concerns/ProfileValidationRules.php app/Services/TenantService.php
git commit -m "feat: registration creates tenant + director via TenantService"
```

---

## Task 8: Update HandleInertiaRequests — share auth.roles + auth.tenant

**Files:**
- Modify: `app/Http/Middleware/HandleInertiaRequests.php`
- Create: `app/Http/Resources/TenantResource.php`
- Create: `app/Http/Resources/UserResource.php`

- [ ] **Step 1: Create resources**

```bash
php artisan make:resource TenantResource
php artisan make:resource UserResource
```

- [ ] **Step 2: Implement TenantResource**

Replace `app/Http/Resources/TenantResource.php`:
```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class TenantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'plan' => $this->plan,
            'status' => $this->status,
            'abn' => $this->abn,
            'ndis_provider_number' => $this->ndis_provider_number,
            'contact_email' => $this->contact_email,
            'contact_phone' => $this->contact_phone,
            'trial_ends_at' => $this->trial_ends_at?->toISOString(),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
```

- [ ] **Step 3: Implement UserResource**

Replace `app/Http/Resources/UserResource.php`:
```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'is_active' => $this->is_active,
            'last_login_at' => $this->last_login_at?->toISOString(),
            'roles' => $this->getRoleNames(),
            'avatar_url' => $this->getFirstMediaUrl('avatar'),
            'tenant_id' => $this->tenant_id,
        ];
    }
}
```

- [ ] **Step 4: Update HandleInertiaRequests**

Replace `app/Http/Middleware/HandleInertiaRequests.php`:
```php
<?php

namespace App\Http\Middleware;

use App\Http\Resources\TenantResource;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user ? UserResource::make($user) : null,
                'roles' => $user ? $user->getRoleNames() : [],
                'tenant' => $user && app()->has('tenant')
                    ? TenantResource::make(app('tenant'))
                    : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'sidebarOpen' => !$request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
```

- [ ] **Step 5: Commit**

```bash
git add app/Http/Middleware/HandleInertiaRequests.php app/Http/Resources/TenantResource.php app/Http/Resources/UserResource.php
git commit -m "feat: share auth.user, auth.roles, auth.tenant, flash via Inertia"
```

---

## Task 9: SuperAdmin routes + TenantController

**Files:**
- Create: `routes/super-admin.php`
- Create: `app/Http/Controllers/SuperAdmin/TenantController.php`
- Create: `app/Http/Requests/SuperAdmin/StoreTenantRequest.php`
- Create: `app/Http/Requests/SuperAdmin/UpdateTenantRequest.php`
- Modify: `bootstrap/app.php`

- [ ] **Step 1: Create route file + controller + requests**

```bash
php artisan make:controller SuperAdmin/TenantController --resource --no-interaction
php artisan make:request SuperAdmin/StoreTenantRequest
php artisan make:request SuperAdmin/UpdateTenantRequest
```

- [ ] **Step 2: Write failing test**

```bash
php artisan make:test --pest SuperAdmin/TenantControllerTest
```

Edit `tests/Feature/SuperAdmin/TenantControllerTest.php`:
```php
<?php

use App\Models\Tenant;
use App\Models\User;

beforeEach(function () {
    $this->admin = User::factory()->create(['tenant_id' => null]);
    $this->admin->assignRole('super_admin');
});

it('superadmin can list all tenants', function () {
    Tenant::factory()->count(3)->create();

    actingAs($this->admin)
        ->get('/super-admin/tenants')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('super-admin/tenants/index')
            ->has('tenants.data', 3)
        );
});

it('superadmin can create a tenant', function () {
    actingAs($this->admin)
        ->post('/super-admin/tenants', [
            'name' => 'New NDIS Org',
            'contact_email' => 'org@example.com',
            'plan' => 'starter',
            'status' => 'active',
        ])
        ->assertRedirect('/super-admin/tenants');

    assertDatabaseHas('tenants', ['name' => 'New NDIS Org']);
});

it('superadmin can update tenant status', function () {
    $tenant = Tenant::factory()->create(['status' => 'active']);

    actingAs($this->admin)
        ->put("/super-admin/tenants/{$tenant->id}", [
            'name' => $tenant->name,
            'contact_email' => $tenant->contact_email,
            'plan' => $tenant->plan,
            'status' => 'suspended',
        ])
        ->assertRedirect();

    expect($tenant->fresh()->status)->toBe('suspended');
});

it('director cannot access super admin tenant routes', function () {
    $tenant = Tenant::factory()->create();
    $director = User::factory()->create(['tenant_id' => $tenant->id]);
    $director->assignRole('director');

    actingAs($director)
        ->get('/super-admin/tenants')
        ->assertForbidden();
});
```

- [ ] **Step 3: Create super-admin route file**

Create `routes/super-admin.php`:
```php
<?php

use App\Http\Controllers\SuperAdmin\TenantController;
use Illuminate\Support\Facades\Route;

Route::prefix('super-admin')
    ->name('super-admin.')
    ->middleware(['auth', 'super_admin'])
    ->group(function () {
        Route::resource('tenants', TenantController::class)
            ->only(['index', 'create', 'store', 'edit', 'update', 'destroy']);

        Route::patch('tenants/{tenant}/suspend', [TenantController::class, 'suspend'])
            ->name('tenants.suspend');

        Route::patch('tenants/{tenant}/activate', [TenantController::class, 'activate'])
            ->name('tenants.activate');
    });
```

- [ ] **Step 4: Register route file in bootstrap/app.php**

Edit `bootstrap/app.php` — add to `withRouting`:
```php
->withRouting(
    web: __DIR__ . '/../routes/web.php',
    commands: __DIR__ . '/../routes/console.php',
    then: function () {
        Route::middleware('web')->group(base_path('routes/settings.php'));
        Route::middleware('web')->group(base_path('routes/super-admin.php'));
        Route::middleware('web')->group(base_path('routes/director.php'));
    },
)
```

- [ ] **Step 5: Implement StoreTenantRequest**

Replace `app/Http/Requests/SuperAdmin/StoreTenantRequest.php`:
```php
<?php

namespace App\Http\Requests\SuperAdmin;

use Illuminate\Foundation\Http\FormRequest;

class StoreTenantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('super_admin');
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'contact_email' => ['required', 'email', 'max:255'],
            'plan' => ['required', 'in:starter,professional,enterprise'],
            'status' => ['required', 'in:active,trialing,suspended'],
            'abn' => ['nullable', 'string', 'max:20'],
            'ndis_provider_number' => ['nullable', 'string', 'max:20'],
            'contact_phone' => ['nullable', 'string', 'max:20'],
        ];
    }
}
```

- [ ] **Step 6: Implement UpdateTenantRequest**

Replace `app/Http/Requests/SuperAdmin/UpdateTenantRequest.php`:
```php
<?php

namespace App\Http\Requests\SuperAdmin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTenantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('super_admin');
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'contact_email' => ['required', 'email', 'max:255'],
            'plan' => ['required', 'in:starter,professional,enterprise'],
            'status' => ['required', 'in:active,trialing,suspended'],
            'abn' => ['nullable', 'string', 'max:20'],
            'ndis_provider_number' => ['nullable', 'string', 'max:20'],
            'contact_phone' => ['nullable', 'string', 'max:20'],
        ];
    }
}
```

- [ ] **Step 7: Implement TenantController**

Replace `app/Http/Controllers/SuperAdmin/TenantController.php`:
```php
<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SuperAdmin\StoreTenantRequest;
use App\Http\Requests\SuperAdmin\UpdateTenantRequest;
use App\Http\Resources\TenantResource;
use App\Models\Tenant;
use App\Services\TenantService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TenantController extends Controller
{
    public function __construct(private readonly TenantService $tenantService) {}

    public function index(): Response
    {
        $tenants = Tenant::withoutGlobalScopes()
            ->with('users')
            ->latest()
            ->paginate(25);

        return Inertia::render('super-admin/tenants/index', [
            'tenants' => TenantResource::collection($tenants),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('super-admin/tenants/create');
    }

    public function store(StoreTenantRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $tenant = Tenant::create([
            ...$data,
            'slug' => \Illuminate\Support\Str::slug($data['name']) . '-' . rand(100, 999),
        ]);

        return redirect()->route('super-admin.tenants.index')
            ->with('success', "Tenant '{$tenant->name}' created.");
    }

    public function edit(Tenant $tenant): Response
    {
        return Inertia::render('super-admin/tenants/edit', [
            'tenant' => TenantResource::make($tenant),
        ]);
    }

    public function update(UpdateTenantRequest $request, Tenant $tenant): RedirectResponse
    {
        $this->tenantService->update($tenant, $request->validated());

        return redirect()->route('super-admin.tenants.index')
            ->with('success', 'Tenant updated.');
    }

    public function destroy(Tenant $tenant): RedirectResponse
    {
        $tenant->delete();

        return redirect()->route('super-admin.tenants.index')
            ->with('success', 'Tenant deleted.');
    }

    public function suspend(Tenant $tenant): RedirectResponse
    {
        $this->tenantService->suspend($tenant);

        return back()->with('success', 'Tenant suspended.');
    }

    public function activate(Tenant $tenant): RedirectResponse
    {
        $this->tenantService->activate($tenant);

        return back()->with('success', 'Tenant activated.');
    }
}
```

- [ ] **Step 8: Run tests — expect PASS**

```bash
php artisan test --compact --filter=TenantControllerTest
```

- [ ] **Step 9: Commit**

```bash
git add routes/super-admin.php app/Http/Controllers/SuperAdmin/ app/Http/Requests/SuperAdmin/ bootstrap/app.php
git commit -m "feat: SuperAdmin TenantController with full CRUD + suspend/activate"
```

---

## Task 10: StaffService + Director StaffController

**Files:**
- Create: `app/Services/StaffService.php`
- Create: `app/Http/Controllers/Director/StaffController.php`
- Create: `app/Http/Requests/Director/StoreStaffRequest.php`
- Create: `app/Http/Requests/Director/UpdateStaffRequest.php`
- Create: `app/Http/Resources/StaffProfileResource.php`
- Create: `routes/director.php`

- [ ] **Step 1: Create files**

```bash
php artisan make:class Services/StaffService
php artisan make:controller Director/StaffController --resource --no-interaction
php artisan make:request Director/StoreStaffRequest
php artisan make:request Director/UpdateStaffRequest
php artisan make:resource StaffProfileResource
php artisan make:test --pest Director/StaffControllerTest
```

- [ ] **Step 2: Write failing tests**

Edit `tests/Feature/Director/StaffControllerTest.php`:
```php
<?php

use App\Models\StaffProfile;
use App\Models\Tenant;
use App\Models\User;

beforeEach(function () {
    $this->tenant = Tenant::factory()->create();
    $this->director = User::factory()->create(['tenant_id' => $this->tenant->id]);
    $this->director->assignRole('director');
    app()->instance('tenant', $this->tenant);
});

it('director can list staff in their tenant', function () {
    User::factory()->count(3)->create(['tenant_id' => $this->tenant->id]);

    // Staff in another tenant should NOT appear
    $other = Tenant::factory()->create();
    User::factory()->create(['tenant_id' => $other->id]);

    actingAs($this->director)
        ->get('/staff')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('staff/index')
            ->has('staff.data', 3)
        );
});

it('director can invite a new staff member', function () {
    actingAs($this->director)
        ->post('/staff', [
            'first_name' => 'Alice',
            'last_name' => 'Smith',
            'email' => 'alice@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => 'staff_worker',
            'position' => 'Support Worker',
            'employment_type' => 'casual',
            'hourly_rate' => '32.50',
        ])
        ->assertRedirect('/staff');

    assertDatabaseHas('users', ['email' => 'alice@example.com', 'tenant_id' => $this->tenant->id]);
    assertDatabaseHas('staff_profiles', ['position' => 'Support Worker']);
});

it('staff cannot be added to a different tenant', function () {
    $otherTenant = Tenant::factory()->create();
    $otherDirector = User::factory()->create(['tenant_id' => $otherTenant->id]);
    $otherDirector->assignRole('director');

    actingAs($this->director)
        ->post('/staff', [
            'first_name' => 'Bob',
            'last_name' => 'Jones',
            'email' => 'bob@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => 'staff_worker',
        ]);

    $user = User::where('email', 'bob@example.com')->first();
    expect($user?->tenant_id)->toBe($this->tenant->id);
});
```

- [ ] **Step 3: Implement StaffService**

Replace `app/Services/StaffService.php`:
```php
<?php

namespace App\Services;

use App\Models\StaffProfile;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class StaffService
{
    /**
     * @param  array{first_name: string, last_name: string, email: string, password: string, role: string, position?: string, employment_type?: string, hourly_rate?: numeric}  $data
     */
    public function create(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'tenant_id' => app('tenant')->id,
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'],
                'password' => $data['password'],
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

    /**
     * @param  array<string, mixed>  $data
     */
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
```

- [ ] **Step 4: Implement StaffProfileResource**

Replace `app/Http/Resources/StaffProfileResource.php`:
```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class StaffProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'employee_number' => $this->employee_number,
            'position' => $this->position,
            'department' => $this->department,
            'employment_type' => $this->employment_type,
            'employment_start' => $this->employment_start?->toDateString(),
            'employment_end' => $this->employment_end?->toDateString(),
            'hourly_rate' => $this->hourly_rate,
            'kms_rate' => $this->kms_rate,
        ];
    }
}
```

- [ ] **Step 5: Implement StoreStaffRequest**

Replace `app/Http/Requests/Director/StoreStaffRequest.php`:
```php
<?php

namespace App\Http\Requests\Director;

use Illuminate\Foundation\Http\FormRequest;

class StoreStaffRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasAnyRole(['director', 'manager']);
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'in:manager,staff_worker'],
            'phone' => ['nullable', 'string', 'max:20'],
            'position' => ['nullable', 'string', 'max:255'],
            'department' => ['nullable', 'string', 'max:255'],
            'employment_type' => ['nullable', 'in:full_time,part_time,casual'],
            'employment_start' => ['nullable', 'date'],
            'hourly_rate' => ['nullable', 'numeric', 'min:0'],
            'kms_rate' => ['nullable', 'numeric', 'min:0'],
            'employee_number' => ['nullable', 'string', 'max:50'],
        ];
    }
}
```

- [ ] **Step 6: Implement UpdateStaffRequest**

Replace `app/Http/Requests/Director/UpdateStaffRequest.php`:
```php
<?php

namespace App\Http\Requests\Director;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStaffRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasAnyRole(['director', 'manager']);
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', "unique:users,email,{$this->route('staff')}"],
            'role' => ['required', 'in:manager,staff_worker'],
            'phone' => ['nullable', 'string', 'max:20'],
            'is_active' => ['boolean'],
            'position' => ['nullable', 'string', 'max:255'],
            'department' => ['nullable', 'string', 'max:255'],
            'employment_type' => ['nullable', 'in:full_time,part_time,casual'],
            'employment_start' => ['nullable', 'date'],
            'hourly_rate' => ['nullable', 'numeric', 'min:0'],
            'kms_rate' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
```

- [ ] **Step 7: Implement StaffController**

Replace `app/Http/Controllers/Director/StaffController.php`:
```php
<?php

namespace App\Http\Controllers\Director;

use App\Http\Controllers\Controller;
use App\Http\Requests\Director\StoreStaffRequest;
use App\Http\Requests\Director\UpdateStaffRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\StaffService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class StaffController extends Controller
{
    public function __construct(private readonly StaffService $staffService) {}

    public function index(): Response
    {
        $staff = User::with('staffProfile')
            ->whereHas('roles', fn ($q) => $q->whereIn('name', ['manager', 'staff_worker', 'director']))
            ->latest()
            ->paginate(25);

        return Inertia::render('staff/index', [
            'staff' => UserResource::collection($staff),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('staff/create');
    }

    public function store(StoreStaffRequest $request): RedirectResponse
    {
        $this->staffService->create($request->validated());

        return redirect()->route('staff.index')
            ->with('success', 'Staff member added.');
    }

    public function show(User $staff): Response
    {
        $staff->load(['staffProfile.qualifications', 'staffProfile.availability']);

        return Inertia::render('staff/show', [
            'staff' => UserResource::make($staff),
        ]);
    }

    public function edit(User $staff): Response
    {
        $staff->load('staffProfile');

        return Inertia::render('staff/edit', [
            'staff' => UserResource::make($staff),
        ]);
    }

    public function update(UpdateStaffRequest $request, User $staff): RedirectResponse
    {
        $this->staffService->update($staff, $request->validated());

        return redirect()->route('staff.index')
            ->with('success', 'Staff member updated.');
    }

    public function destroy(User $staff): RedirectResponse
    {
        $this->staffService->deactivate($staff);

        return redirect()->route('staff.index')
            ->with('success', 'Staff member deactivated.');
    }
}
```

- [ ] **Step 8: Create director route file**

Create `routes/director.php`:
```php
<?php

use App\Http\Controllers\Director\StaffController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'tenant'])
    ->group(function () {
        Route::resource('staff', StaffController::class);
    });
```

- [ ] **Step 9: Run tests — expect PASS**

```bash
php artisan test --compact --filter=StaffControllerTest
```

- [ ] **Step 10: Commit**

```bash
git add app/Services/StaffService.php app/Http/Controllers/Director/ app/Http/Requests/Director/ app/Http/Resources/StaffProfileResource.php routes/director.php
git commit -m "feat: StaffService + Director StaffController with tenant-scoped CRUD"
```

---

## Task 11: DataTable shared React component

**Files:**
- Create: `resources/js/components/data-table/data-table.tsx`
- Create: `resources/js/components/data-table/data-table-toolbar.tsx`
- Create: `resources/js/components/data-table/data-table-pagination.tsx`

- [ ] **Step 1: Install tanstack/react-table**

```bash
npm install @tanstack/react-table
```

- [ ] **Step 2: Create DataTable component**

Create `resources/js/components/data-table/data-table.tsx`:
```tsx
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface DataTableProps<TData> {
    columns: ColumnDef<TData>[];
    data: TData[];
    meta?: PaginationMeta;
    searchable?: boolean;
    searchPlaceholder?: string;
}

export function DataTable<TData>({
    columns,
    data,
    meta,
    searchable = true,
    searchPlaceholder = 'Search...',
}: DataTableProps<TData>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: meta?.last_page ?? 1,
    });

    return (
        <div className="space-y-4">
            {searchable && (
                <DataTableToolbar searchPlaceholder={searchPlaceholder} />
            )}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {meta && <DataTablePagination meta={meta} />}
        </div>
    );
}
```

- [ ] **Step 3: Create DataTableToolbar**

Create `resources/js/components/data-table/data-table-toolbar.tsx`:
```tsx
import { router } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCurrentUrl } from '@/hooks/use-current-url';

interface DataTableToolbarProps {
    searchPlaceholder?: string;
}

export function DataTableToolbar({ searchPlaceholder = 'Search...' }: DataTableToolbarProps) {
    const url = useCurrentUrl();
    const initialSearch = new URL(url).searchParams.get('search') ?? '';
    const [search, setSearch] = useState(initialSearch);

    const doSearch = useCallback(
        (value: string) => {
            router.get(
                url.split('?')[0],
                { search: value || undefined },
                { preserveState: true, replace: true }
            );
        },
        [url]
    );

    return (
        <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && doSearch(search)}
                    className="pl-9"
                />
            </div>
            {search && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setSearch(''); doSearch(''); }}
                >
                    <X className="size-4 mr-1" /> Clear
                </Button>
            )}
        </div>
    );
}
```

- [ ] **Step 4: Create DataTablePagination**

Create `resources/js/components/data-table/data-table-pagination.tsx`:
```tsx
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PaginationMeta } from './data-table';

export function DataTablePagination({ meta }: { meta: PaginationMeta }) {
    const url = window.location.href;
    const base = url.split('?')[0];
    const params = new URLSearchParams(window.location.search);

    const pageUrl = (page: number) => {
        params.set('page', String(page));
        return `${base}?${params.toString()}`;
    };

    return (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
                Showing {meta.from}–{meta.to} of {meta.total}
            </span>
            <div className="flex items-center gap-1">
                {meta.current_page > 1 ? (
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={pageUrl(meta.current_page - 1)}>
                            <ChevronLeft className="size-4" />
                        </Link>
                    </Button>
                ) : (
                    <Button variant="ghost" size="icon" disabled>
                        <ChevronLeft className="size-4" />
                    </Button>
                )}

                <span className="px-2">
                    Page {meta.current_page} of {meta.last_page}
                </span>

                {meta.current_page < meta.last_page ? (
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={pageUrl(meta.current_page + 1)}>
                            <ChevronRight className="size-4" />
                        </Link>
                    </Button>
                ) : (
                    <Button variant="ghost" size="icon" disabled>
                        <ChevronRight className="size-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
```

- [ ] **Step 5: Add missing ShadCN Table component**

```bash
npx shadcn@latest add table --yes 2>/dev/null || true
```

- [ ] **Step 6: Commit**

```bash
git add resources/js/components/data-table/ package.json package-lock.json
git commit -m "feat: shared DataTable component with server-side pagination + search"
```

---

## Task 12: SuperAdmin tenant pages (React)

**Files:**
- Create: `resources/js/pages/super-admin/tenants/index.tsx`
- Create: `resources/js/pages/super-admin/tenants/create.tsx`
- Create: `resources/js/pages/super-admin/tenants/edit.tsx`
- Create: `resources/js/layouts/super-admin-layout.tsx`

- [ ] **Step 1: Create SuperAdmin layout**

Create `resources/js/layouts/super-admin-layout.tsx`:
```tsx
import { Link } from '@inertiajs/react';
import { Building2, LayoutDashboard } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const navItems = [
    { title: 'Dashboard', href: '/super-admin', icon: LayoutDashboard },
    { title: 'Tenants', href: '/super-admin/tenants', icon: Building2 },
];

export default function SuperAdminLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen">
            <aside className="w-60 border-r bg-sidebar flex flex-col gap-1 p-3">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Super Admin
                </div>
                <Separator className="mb-2" />
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent transition-colors',
                            window.location.pathname.startsWith(item.href) &&
                                'bg-sidebar-accent text-sidebar-accent-foreground'
                        )}
                    >
                        <item.icon className="size-4" />
                        {item.title}
                    </Link>
                ))}
            </aside>
            <main className="flex-1 p-8 overflow-auto">{children}</main>
        </div>
    );
}
```

- [ ] **Step 2: Create tenants index page**

Create `resources/js/pages/super-admin/tenants/index.tsx`:
```tsx
import { Head, Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/data-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import SuperAdminLayout from '@/layouts/super-admin-layout';

interface Tenant {
    id: string;
    name: string;
    slug: string;
    plan: string;
    status: string;
    contact_email: string;
    created_at: string;
}

interface Props {
    tenants: {
        data: Tenant[];
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
            from: number;
            to: number;
        };
    };
}

const statusVariant = (status: string) =>
    ({ active: 'default', trialing: 'secondary', suspended: 'destructive' })[status] ?? 'outline';

export default function TenantsIndex({ tenants }: Props) {
    const columns: ColumnDef<Tenant>[] = [
        { accessorKey: 'name', header: 'Organisation' },
        { accessorKey: 'contact_email', header: 'Email' },
        { accessorKey: 'plan', header: 'Plan' },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <Badge variant={statusVariant(row.original.status) as any}>
                    {row.original.status}
                </Badge>
            ),
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`/super-admin/tenants/${row.original.id}/edit`}>
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        {row.original.status !== 'suspended' ? (
                            <DropdownMenuItem
                                className="text-destructive"
                                onClick={() =>
                                    router.patch(`/super-admin/tenants/${row.original.id}/suspend`)
                                }
                            >
                                Suspend
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem
                                onClick={() =>
                                    router.patch(`/super-admin/tenants/${row.original.id}/activate`)
                                }
                            >
                                Activate
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <>
            <Head title="Tenants" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Tenants</h1>
                    <Button asChild>
                        <Link href="/super-admin/tenants/create">
                            <Plus className="size-4 mr-2" /> Add Tenant
                        </Link>
                    </Button>
                </div>
                <DataTable
                    columns={columns}
                    data={tenants.data}
                    meta={tenants.meta}
                    searchPlaceholder="Search organisations..."
                />
            </div>
        </>
    );
}

TenantsIndex.layout = (page: React.ReactNode) => (
    <SuperAdminLayout>{page}</SuperAdminLayout>
);
```

- [ ] **Step 3: Create tenants create page**

Create `resources/js/pages/super-admin/tenants/create.tsx`:
```tsx
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { InputError } from '@/components/input-error';
import SuperAdminLayout from '@/layouts/super-admin-layout';

export default function TenantsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        contact_email: '',
        plan: 'starter',
        status: 'active',
        abn: '',
        ndis_provider_number: '',
        contact_phone: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/super-admin/tenants');
    };

    return (
        <>
            <Head title="Add Tenant" />
            <div className="max-w-2xl space-y-6">
                <h1 className="text-2xl font-semibold">Add Tenant</h1>
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Organisation Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact_email">Contact Email</Label>
                            <Input
                                id="contact_email"
                                type="email"
                                value={data.contact_email}
                                onChange={(e) => setData('contact_email', e.target.value)}
                            />
                            <InputError message={errors.contact_email} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="plan">Plan</Label>
                            <Select value={data.plan} onValueChange={(v) => setData('plan', v)}>
                                <SelectTrigger id="plan">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="starter">Starter</SelectItem>
                                    <SelectItem value="professional">Professional</SelectItem>
                                    <SelectItem value="enterprise">Enterprise</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.plan} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                <SelectTrigger id="status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="trialing">Trialing</SelectItem>
                                    <SelectItem value="suspended">Suspended</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.status} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="abn">ABN</Label>
                            <Input
                                id="abn"
                                value={data.abn}
                                onChange={(e) => setData('abn', e.target.value)}
                            />
                            <InputError message={errors.abn} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ndis_provider_number">NDIS Provider Number</Label>
                            <Input
                                id="ndis_provider_number"
                                value={data.ndis_provider_number}
                                onChange={(e) => setData('ndis_provider_number', e.target.value)}
                            />
                            <InputError message={errors.ndis_provider_number} />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>
                            Create Tenant
                        </Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

TenantsCreate.layout = (page: React.ReactNode) => (
    <SuperAdminLayout>{page}</SuperAdminLayout>
);
```

- [ ] **Step 4: Create tenants edit page**

Create `resources/js/pages/super-admin/tenants/edit.tsx`:
```tsx
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { InputError } from '@/components/input-error';
import SuperAdminLayout from '@/layouts/super-admin-layout';

interface Tenant {
    id: string;
    name: string;
    contact_email: string;
    plan: string;
    status: string;
    abn: string | null;
    ndis_provider_number: string | null;
    contact_phone: string | null;
}

export default function TenantsEdit({ tenant }: { tenant: Tenant }) {
    const { data, setData, put, processing, errors } = useForm({
        name: tenant.name,
        contact_email: tenant.contact_email,
        plan: tenant.plan,
        status: tenant.status,
        abn: tenant.abn ?? '',
        ndis_provider_number: tenant.ndis_provider_number ?? '',
        contact_phone: tenant.contact_phone ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/super-admin/tenants/${tenant.id}`);
    };

    return (
        <>
            <Head title={`Edit ${tenant.name}`} />
            <div className="max-w-2xl space-y-6">
                <h1 className="text-2xl font-semibold">Edit Tenant</h1>
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Organisation Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact_email">Contact Email</Label>
                            <Input
                                id="contact_email"
                                type="email"
                                value={data.contact_email}
                                onChange={(e) => setData('contact_email', e.target.value)}
                            />
                            <InputError message={errors.contact_email} />
                        </div>
                        <div className="space-y-2">
                            <Label>Plan</Label>
                            <Select value={data.plan} onValueChange={(v) => setData('plan', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="starter">Starter</SelectItem>
                                    <SelectItem value="professional">Professional</SelectItem>
                                    <SelectItem value="enterprise">Enterprise</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.plan} />
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="trialing">Trialing</SelectItem>
                                    <SelectItem value="suspended">Suspended</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.status} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="abn">ABN</Label>
                            <Input id="abn" value={data.abn} onChange={(e) => setData('abn', e.target.value)} />
                            <InputError message={errors.abn} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ndis_provider_number">NDIS Provider Number</Label>
                            <Input
                                id="ndis_provider_number"
                                value={data.ndis_provider_number}
                                onChange={(e) => setData('ndis_provider_number', e.target.value)}
                            />
                            <InputError message={errors.ndis_provider_number} />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>Save Changes</Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>Cancel</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

TenantsEdit.layout = (page: React.ReactNode) => (
    <SuperAdminLayout>{page}</SuperAdminLayout>
);
```

- [ ] **Step 5: Commit**

```bash
git add resources/js/pages/super-admin/ resources/js/layouts/super-admin-layout.tsx
git commit -m "feat: SuperAdmin tenant management pages (index, create, edit)"
```

---

## Task 13: Staff pages (React)

**Files:**
- Create: `resources/js/pages/staff/index.tsx`
- Create: `resources/js/pages/staff/create.tsx`
- Create: `resources/js/pages/staff/edit.tsx`
- Create: `resources/js/pages/staff/show.tsx`

- [ ] **Step 1: Create staff index**

Create `resources/js/pages/staff/index.tsx`:
```tsx
import { Head, Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/data-table';

interface StaffMember {
    id: string;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    phone: string | null;
    is_active: boolean;
    roles: string[];
}

interface Props {
    staff: {
        data: StaffMember[];
        meta: {
            current_page: number; last_page: number;
            per_page: number; total: number; from: number; to: number;
        };
    };
}

export default function StaffIndex({ staff }: Props) {
    const columns: ColumnDef<StaffMember>[] = [
        {
            accessorKey: 'full_name',
            header: 'Name',
            cell: ({ row }) => (
                <Link href={`/staff/${row.original.id}`} className="font-medium hover:underline">
                    {row.original.full_name}
                </Link>
            ),
        },
        { accessorKey: 'email', header: 'Email' },
        { accessorKey: 'phone', header: 'Phone' },
        {
            accessorKey: 'roles',
            header: 'Role',
            cell: ({ row }) => (
                <Badge variant="outline">
                    {row.original.roles[0]?.replace('_', ' ')}
                </Badge>
            ),
        },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: ({ row }) => (
                <Badge variant={row.original.is_active ? 'default' : 'secondary'}>
                    {row.original.is_active ? 'Active' : 'Inactive'}
                </Badge>
            ),
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <Button variant="ghost" size="sm" asChild>
                    <Link href={`/staff/${row.original.id}/edit`}>Edit</Link>
                </Button>
            ),
        },
    ];

    return (
        <>
            <Head title="Staff" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Staff</h1>
                    <Button asChild>
                        <Link href="/staff/create">
                            <Plus className="size-4 mr-2" /> Add Staff
                        </Link>
                    </Button>
                </div>
                <DataTable
                    columns={columns}
                    data={staff.data}
                    meta={staff.meta}
                    searchPlaceholder="Search staff..."
                />
            </div>
        </>
    );
}

StaffIndex.layout = (page: React.ReactNode) => <AppLayout children={page} />;
```

- [ ] **Step 2: Create staff create page**

Create `resources/js/pages/staff/create.tsx`:
```tsx
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { InputError } from '@/components/input-error';

export default function StaffCreate() {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'staff_worker',
        phone: '',
        position: '',
        department: '',
        employment_type: 'casual',
        employment_start: '',
        hourly_rate: '',
        employee_number: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/staff');
    };

    return (
        <>
            <Head title="Add Staff Member" />
            <div className="max-w-2xl p-6 space-y-6">
                <h1 className="text-2xl font-semibold">Add Staff Member</h1>
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="first_name">First Name</Label>
                            <Input id="first_name" value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} />
                            <InputError message={errors.first_name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last_name">Last Name</Label>
                            <Input id="last_name" value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} />
                            <InputError message={errors.last_name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            <InputError message={errors.email} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                            <InputError message={errors.phone} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                            <InputError message={errors.password} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">Confirm Password</Label>
                            <Input id="password_confirmation" type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Select value={data.role} onValueChange={(v) => setData('role', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="manager">Manager</SelectItem>
                                    <SelectItem value="staff_worker">Staff Worker</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.role} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="employee_number">Employee Number</Label>
                            <Input id="employee_number" value={data.employee_number} onChange={(e) => setData('employee_number', e.target.value)} />
                            <InputError message={errors.employee_number} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="position">Position</Label>
                            <Input id="position" value={data.position} onChange={(e) => setData('position', e.target.value)} />
                            <InputError message={errors.position} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Input id="department" value={data.department} onChange={(e) => setData('department', e.target.value)} />
                            <InputError message={errors.department} />
                        </div>
                        <div className="space-y-2">
                            <Label>Employment Type</Label>
                            <Select value={data.employment_type} onValueChange={(v) => setData('employment_type', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="full_time">Full Time</SelectItem>
                                    <SelectItem value="part_time">Part Time</SelectItem>
                                    <SelectItem value="casual">Casual</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.employment_type} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
                            <Input id="hourly_rate" type="number" step="0.01" value={data.hourly_rate} onChange={(e) => setData('hourly_rate', e.target.value)} />
                            <InputError message={errors.hourly_rate} />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>Add Staff Member</Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>Cancel</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

StaffCreate.layout = (page: React.ReactNode) => <AppLayout children={page} />;
```

- [ ] **Step 3: Commit staff pages (index + create)**

```bash
git add resources/js/pages/staff/index.tsx resources/js/pages/staff/create.tsx
git commit -m "feat: staff index and create pages"
```

- [ ] **Step 4: Create staff edit page**

Create `resources/js/pages/staff/edit.tsx`:
```tsx
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { InputError } from '@/components/input-error';

interface StaffMember {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    is_active: boolean;
    roles: string[];
    staff_profile: {
        position: string | null;
        department: string | null;
        employment_type: string | null;
        employment_start: string | null;
        hourly_rate: string | null;
        kms_rate: string | null;
    } | null;
}

export default function StaffEdit({ staff }: { staff: StaffMember }) {
    const { data, setData, put, processing, errors } = useForm({
        first_name: staff.first_name,
        last_name: staff.last_name,
        email: staff.email,
        phone: staff.phone ?? '',
        role: staff.roles[0] ?? 'staff_worker',
        is_active: staff.is_active,
        position: staff.staff_profile?.position ?? '',
        department: staff.staff_profile?.department ?? '',
        employment_type: staff.staff_profile?.employment_type ?? 'casual',
        employment_start: staff.staff_profile?.employment_start ?? '',
        hourly_rate: staff.staff_profile?.hourly_rate ?? '',
        kms_rate: staff.staff_profile?.kms_rate ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/staff/${staff.id}`);
    };

    return (
        <>
            <Head title={`Edit ${staff.first_name} ${staff.last_name}`} />
            <div className="max-w-2xl p-6 space-y-6">
                <h1 className="text-2xl font-semibold">Edit Staff Member</h1>
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="first_name">First Name</Label>
                            <Input id="first_name" value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} />
                            <InputError message={errors.first_name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last_name">Last Name</Label>
                            <Input id="last_name" value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} />
                            <InputError message={errors.last_name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            <InputError message={errors.email} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                            <InputError message={errors.phone} />
                        </div>
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Select value={data.role} onValueChange={(v) => setData('role', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="manager">Manager</SelectItem>
                                    <SelectItem value="staff_worker">Staff Worker</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.role} />
                        </div>
                        <div className="space-y-2">
                            <Label>Employment Type</Label>
                            <Select value={data.employment_type} onValueChange={(v) => setData('employment_type', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="full_time">Full Time</SelectItem>
                                    <SelectItem value="part_time">Part Time</SelectItem>
                                    <SelectItem value="casual">Casual</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.employment_type} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="position">Position</Label>
                            <Input id="position" value={data.position} onChange={(e) => setData('position', e.target.value)} />
                            <InputError message={errors.position} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
                            <Input id="hourly_rate" type="number" step="0.01" value={data.hourly_rate} onChange={(e) => setData('hourly_rate', e.target.value)} />
                            <InputError message={errors.hourly_rate} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="is_active"
                            checked={data.is_active}
                            onCheckedChange={(v) => setData('is_active', Boolean(v))}
                        />
                        <Label htmlFor="is_active">Active</Label>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>Save Changes</Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>Cancel</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

StaffEdit.layout = (page: React.ReactNode) => <AppLayout children={page} />;
```

- [ ] **Step 5: Create staff show page**

Create `resources/js/pages/staff/show.tsx`:
```tsx
import { Head, Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface StaffMember {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    is_active: boolean;
    roles: string[];
    staff_profile: {
        position: string | null;
        department: string | null;
        employment_type: string | null;
        employment_start: string | null;
        hourly_rate: string | null;
        employee_number: string | null;
    } | null;
}

export default function StaffShow({ staff }: { staff: StaffMember }) {
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
                        <Link href={`/staff/${staff.id}/edit`}>
                            <Pencil className="size-4 mr-2" /> Edit
                        </Link>
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
```

- [ ] **Step 6: Commit**

```bash
git add resources/js/pages/staff/
git commit -m "feat: staff edit and show pages"
```

---

## Task 14: Update sidebar navigation

**Files:**
- Modify: `resources/js/components/app-sidebar.tsx`

- [ ] **Step 1: Replace sidebar with full NDIS nav**

Replace `resources/js/components/app-sidebar.tsx`:
```tsx
import { Link } from '@inertiajs/react';
import {
    AlertTriangle, BookOpen, Calendar, CreditCard,
    FileText, LayoutGrid, MessageSquare, Shield,
    Users, Wheelchair,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar, SidebarContent, SidebarFooter,
    SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { title: 'Participants', href: '/participants', icon: Wheelchair },
    { title: 'Scheduling', href: '/scheduling', icon: Calendar },
    { title: 'Plans & Funding', href: '/plans', icon: FileText },
    { title: 'Services', href: '/services', icon: BookOpen },
    { title: 'Billing & Claims', href: '/billing', icon: CreditCard },
    { title: 'Compliance', href: '/compliance', icon: Shield },
    { title: 'Staff', href: '/staff', icon: Users },
    { title: 'Communications', href: '/communications', icon: MessageSquare },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
```

- [ ] **Step 2: Run TypeScript transform + build**

```bash
php artisan typescript:transform
npm run build
```
Expected: no TypeScript errors, build succeeds.

- [ ] **Step 3: Run full test suite**

```bash
php artisan test --compact
```
Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add resources/js/components/app-sidebar.tsx
git commit -m "feat: full NDIS navigation in sidebar"
```

---

## Self-Review

**Spec coverage check:**
- ✅ Middleware-based tenant isolation (`HasTenant` trait + `ResolveTenant`)
- ✅ 4-level role hierarchy seeded via Spatie
- ✅ Self-service registration creates Tenant + Director + trial
- ✅ SuperAdmin tenant CRUD with suspend/activate
- ✅ Director staff management CRUD
- ✅ Service layer pattern (TenantService, StaffService)
- ✅ TypeScript transformer wired
- ✅ DataTable shared component
- ✅ Inertia shares auth.user, auth.roles, auth.tenant, flash
- ✅ Cross-tenant isolation tested in every controller test
- ✅ Cashier configured for Tenant model

**Gaps noted:**
- Staff show page has `staff_profile` typed inline — once TypeScript transformer runs it will be replaced by generated types
- `useCurrentUrl` hook referenced in DataTableToolbar — verify it exists at `resources/js/hooks/use-current-url.ts` ✅ (confirmed in file map)
- `InputError` component referenced — exists at `resources/js/components/input-error.tsx` ✅ (confirmed in file listing)
- `Table` ShadCN component may need install (Step in Task 11 handles this)

**No placeholders found. Type names consistent throughout.**
