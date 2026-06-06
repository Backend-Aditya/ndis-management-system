# NDIS SaaS — Full Modules Design

**Date:** 2026-06-05
**Stack:** Laravel 13 · Inertia v3 · React 19 · ShadCN UI · TailwindCSS v4 · Spatie Permissions · Laravel Cashier v16 · Spatie Media Library · Spatie TypeScript Transformer

---

## 1. Scope & Decomposition

Too large to implement as one unit. Broken into 8 sequential phases, each independently deliverable:

| Phase | Modules | Depends On |
|-------|---------|------------|
| 1 — Foundation | Models, factories, HasTenant trait, middleware, base service, TypeScript types | — |
| 2 — Identity | Tenant management (superadmin), Staff/User management (director) | 1 |
| 3 — Participants | Participants, contacts, goals, diagnoses, support coordinators | 2 |
| 4 — Plans & Services | NDIS plans, categories, items, plan managers, service types, agreements | 3 |
| 5 — Scheduling | Shifts, recurrences, cancellations, handover notes, leave requests | 4 |
| 6 — Billing | Invoices, line items, NDIS claims, payments | 5 |
| 7 — Compliance | Incidents, risk assessments, BSPs, restrictive practices, audits | 5 |
| 8 — Communications | Messages, notifications, announcements, audit logs | 2 |

**Current scope: Phase 1 + Phase 2** — all subsequent phases follow identical patterns established here.

---

## 2. Role Hierarchy

| Role | Scope | Key Capabilities |
|------|-------|-----------------|
| `super_admin` | Platform-wide | Manage all tenants, impersonate directors, view billing across tenants |
| `director` | Own tenant | Full access to all tenant data, manage staff, configure services, Cashier subscription owner |
| `manager` | Own tenant | Manage shifts, view participants, approve leave — no billing/settings |
| `staff_worker` | Own tenant | Own shifts, assigned participant records, handover notes |

Roles seeded via Spatie. SuperAdmin is seeded via `DatabaseSeeder` with credentials from `.env`. Directors created on registration.

---

## 3. Tenant Resolution

**Middleware chain:**
```
web → auth → ResolveTenant → (role-specific middleware)
```

`ResolveTenant` middleware:
- Reads `auth()->user()->tenant_id`
- Loads tenant, stores as `app()->instance('tenant', $tenant)`
- SuperAdmin routes (`/super-admin/*`) bypass this middleware entirely — separate route group with `RequireSuperAdmin` middleware

**`HasTenant` trait (applied to every tenant-scoped model):**
- `boot()` — adds `GlobalScope` filtering by `app('tenant')->id`
- `creating()` — auto-fills `tenant_id` from `app('tenant')`
- Relationship: `belongsTo(Tenant::class)`

---

## 4. Registration Flow (Director Onboarding)

```
POST /register
  → Fortify CreateNewUser hook (customised)
  → TenantService::createWithDirector(array $data): array{Tenant, User}
      1. DB::transaction()
      2. Tenant::create([name, slug, plan='starter', status='trialing'])
      3. User::create([...data, tenant_id, role=director])
      4. $tenant->newTrial(days: 14)  // Cashier
  → Fortify logs user in
  → Redirect to /dashboard
```

---

## 5. Architecture

### Backend

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── SuperAdmin/          # Tenant CRUD, user impersonation
│   │   ├── Director/            # Staff, settings, subscriptions
│   │   ├── Manager/             # Scheduling oversight
│   │   └── Staff/               # Own shifts, handover
│   ├── Middleware/
│   │   ├── ResolveTenant.php
│   │   └── RequireSuperAdmin.php
│   └── Requests/                # One FormRequest per store/update action
├── Models/                      # All 35 models, relationships, casts
├── Services/
│   ├── TenantService.php
│   ├── StaffService.php
│   ├── ParticipantService.php
│   ├── PlanService.php
│   ├── ShiftService.php
│   ├── BillingService.php
│   ├── ComplianceService.php
│   └── CommunicationService.php
├── Policies/                    # One policy per model
├── Resources/                   # JsonResource per model, annotated #[TypeScript]
└── Concerns/
    └── HasTenant.php
```

**Service class contract:**
- Receives validated scalar data (arrays from FormRequest)
- Returns Eloquent models or collections
- No HTTP concerns (no Request, no Response)
- Injected into controllers via constructor DI

**Controller contract:**
- Receives `Request`, calls one service method, returns Inertia render or redirect
- No business logic
- One controller per resource group (index+show in one, store/update/destroy in another if needed)

### Frontend

```
resources/js/
├── pages/
│   ├── super-admin/
│   │   └── tenants/             # index, show, edit
│   ├── participants/            # index, create, edit, show
│   ├── staff/                   # index, create, edit, show
│   ├── plans/
│   ├── scheduling/
│   ├── billing/
│   ├── compliance/
│   └── communications/
├── components/
│   ├── ui/                      # existing ShadCN components
│   └── data-table/              # shared server-driven table
│       ├── data-table.tsx
│       ├── data-table-toolbar.tsx
│       ├── data-table-pagination.tsx
│       └── columns/             # column defs per resource
└── types/                       # auto-generated by TypeScript Transformer
```

---

## 6. Frontend Patterns

### DataTable (shared, used by every index page)
- Server-side pagination and filtering via Inertia visits
- Columns defined per resource as `ColumnDef[]`
- Filter bar with search input + status/role dropdowns
- Row actions: View, Edit, Delete (permission-gated)
- Bulk select for future batch operations

### Form pattern
- **Simple creates** (contacts, goals, qualifications): `<Sheet>` slides in, no page nav
- **Complex creates** (participants, shifts, invoices): dedicated `/create` page
- All forms: `react-hook-form` + `zod` schema matching server `FormRequest` rules
- Server validation errors mapped back to fields via Inertia's `useForm` errors

### Shared Inertia props (`HandleInertiaRequests`):
```php
'auth' => [
    'user'   => UserResource::make($user),   // #[TypeScript]
    'roles'  => $user->getRoleNames(),
    'tenant' => TenantResource::make($tenant), // null for super_admin
],
'flash' => ['success' => ..., 'error' => ...],
```

### Navigation (sidebar groups):
```
Dashboard
─ Participants
─ Scheduling       (Shifts · Leave · Availability)
─ Plans & Funding
─ Services
─ Billing & Claims
─ Compliance
─ Staff
─ Communications
[director only] Settings · Subscription
[super_admin]   separate /super-admin layout — All Tenants
```

---

## 7. TypeScript Type Generation

Package: `spatie/laravel-typescript-transformer`

- Every `JsonResource` annotated `#[TypeScript]`
- Build step runs transformer → outputs `resources/js/types/generated.d.ts`
- Wayfinder generates `resources/js/routes/` and `resources/js/actions/` (already wired)
- Manual types only for non-model shapes (pagination meta, flash, nav items)

---

## 8. Authorization

- Every model has a `Policy` registered in `AuthServiceProvider`
- Policy methods: `viewAny`, `view`, `create`, `update`, `delete`
- Director: passes for any resource belonging to their tenant
- Manager: passes for resources within their assigned scope
- Staff Worker: passes only for own shifts and assigned participant records
- Cross-tenant isolation tested explicitly in every policy test

---

## 9. Testing Strategy

**Framework:** Pest v4 · SQLite in-memory · real DB (no mocks)

```
tests/Feature/
├── Auth/RegistrationTest.php
├── SuperAdmin/TenantTest.php
├── Staff/StaffProfileTest.php
├── Participants/ParticipantTest.php
├── Scheduling/ShiftTest.php
├── Billing/InvoiceTest.php
├── Compliance/IncidentTest.php
└── Communications/MessageTest.php
```

**Every module test covers:**
1. Index returns correct tenant-scoped data
2. Store creates record with correct tenant_id
3. Update works for authorised role
4. Delete blocked for unauthorised role
5. Cross-tenant isolation (another tenant's user cannot access)

**Factory conventions:**
- Every model has a factory
- Factories have role states: `User::factory()->director()`, `User::factory()->forTenant($tenant)`
- Complex scenarios use `setUp` with explicit tenant + user creation

---

## 10. Key Constraints

- `laravel/mcp` (Boost) is a dev tool only — not exposed in the application
- No separate DB per tenant — shared DB with `HasTenant` global scope
- Cashier billable model is `Tenant`, not `User` — `Billable` trait moves to `Tenant` model
- `spatie/laravel-typescript-transformer` must be added as a dependency (approved)
- Media Library handles all file uploads (participant docs, staff avatars) via `HasMedia`
- Audit logging written to `audit_logs` table via model observer, not a package
