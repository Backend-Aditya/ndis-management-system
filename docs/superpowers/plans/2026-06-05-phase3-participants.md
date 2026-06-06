# Phase 3 — Participants Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans or implement directly. Steps use checkbox syntax for tracking.

**Goal:** Build complete Participant CRUD with related records (contacts, goals, diagnoses, support coordinators) following identical pattern to Phase 2.

**Architecture:** Same as Phase 2 — HasTenant + HasUuids models, ParticipantService, thin controllers, #[TypeScript] resources, React pages with DataTable + tabbed show view.

**Tech Stack:** Laravel 13 · Inertia v3 · React 19 · ShadCN UI · Spatie Media Library (for participant documents)

---

## File Map

### Backend (new)
- `app/Models/Participant.php`
- `app/Models/ParticipantContact.php`
- `app/Models/ParticipantGoal.php`
- `app/Models/ParticipantDiagnosis.php`
- `app/Models/SupportCoordinator.php`
- `app/Services/ParticipantService.php`
- `app/Http/Controllers/Director/ParticipantController.php`
- `app/Http/Controllers/Director/ParticipantContactController.php`
- `app/Http/Controllers/Director/ParticipantGoalController.php`
- `app/Http/Controllers/Director/ParticipantDiagnosisController.php`
- `app/Http/Requests/Director/StoreParticipantRequest.php`
- `app/Http/Requests/Director/UpdateParticipantRequest.php`
- `app/Http/Requests/Director/StoreParticipantContactRequest.php`
- `app/Http/Requests/Director/StoreParticipantGoalRequest.php`
- `app/Http/Requests/Director/StoreParticipantDiagnosisRequest.php`
- `app/Http/Resources/ParticipantResource.php` (#[TypeScript])
- `app/Http/Resources/ParticipantContactResource.php` (#[TypeScript])
- `app/Http/Resources/ParticipantGoalResource.php` (#[TypeScript])
- `app/Http/Resources/ParticipantDiagnosisResource.php` (#[TypeScript])
- `database/factories/ParticipantFactory.php`
- `routes/participants.php`

### Frontend (new)
- `resources/js/pages/participants/index.tsx`
- `resources/js/pages/participants/create.tsx`
- `resources/js/pages/participants/edit.tsx`
- `resources/js/pages/participants/show.tsx` (tabbed: Overview, Contacts, Goals, Diagnoses)

### Modified
- `routes/director.php` — add participant routes
- `resources/js/types/models.ts` — add Participant, ParticipantContact, ParticipantGoal, ParticipantDiagnosis types

---

## Task 1: Participant model + related models + factories

### Models

**Participant** (`app/Models/Participant.php`):
- Traits: HasUuids, HasTenant, HasFactory, HasMedia (InteractsWithMedia)
- Implements: HasMedia
- Fillable: tenant_id, ndis_number, first_name, last_name, date_of_birth, gender, pronouns, address, suburb, state, postcode, primary_language, interpreter_required, communication_needs, cultural_background, participant_status
- Casts: date_of_birth→date, interpreter_required→boolean
- Relationships: contacts() HasMany, goals() HasMany, diagnoses() HasMany, supportCoordinators() HasMany
- Accessor: getFullNameAttribute()
- registerMediaCollections(): 'documents' (multiple files)

**ParticipantContact** (`app/Models/ParticipantContact.php`):
- Traits: HasUuids, HasFactory
- Fillable: participant_id, relationship, first_name, last_name, phone, email, is_emergency, is_authorised_rep
- Casts: is_emergency→boolean, is_authorised_rep→boolean
- Relationship: participant() BelongsTo

**ParticipantGoal** (`app/Models/ParticipantGoal.php`):
- Traits: HasUuids, HasFactory
- Fillable: participant_id, goal_text, category, status, target_date, progress_notes
- Casts: target_date→date
- Relationship: participant() BelongsTo

**ParticipantDiagnosis** (`app/Models/ParticipantDiagnosis.php`):
- Traits: HasUuids, HasFactory
- Fillable: participant_id, diagnosis_name, icd_10_code, diagnosed_date, is_primary
- Casts: diagnosed_date→date, is_primary→boolean
- Relationship: participant() BelongsTo

**SupportCoordinator** (`app/Models/SupportCoordinator.php`):
- Traits: HasUuids, HasFactory
- Fillable: participant_id, staff_id, assigned_from, is_active
- Casts: assigned_from→date, is_active→boolean
- Relationships: participant() BelongsTo, staff() BelongsTo User (FK: staff_id)

### ParticipantFactory
- ndis_number: unique numerify('43########')
- first_name, last_name, date_of_birth (dateTimeBetween('-80y','-5y'))
- gender: randomElement(['male','female','non_binary','prefer_not_to_say'])
- suburb, state: randomElement(['NSW','VIC','QLD','SA','WA','TAS','ACT','NT'])
- postcode: numerify('####')
- participant_status: randomElement(['active','inactive','pending'])
- interpreter_required: boolean()

### Test: `tests/Feature/ParticipantModelTest.php`
```php
it('participant scoped to tenant', function () {
    // ...standard HasTenant scope test
});
it('participant has contacts relationship', function () { ... });
it('participant full name accessor works', function () { ... });
```

---

## Task 2: ParticipantService

**`app/Services/ParticipantService.php`:**

```php
public function create(array $data): Participant  // creates with tenant_id from app('tenant')
public function update(Participant $participant, array $data): Participant
public function addContact(Participant $participant, array $data): ParticipantContact
public function updateContact(ParticipantContact $contact, array $data): ParticipantContact
public function deleteContact(ParticipantContact $contact): void
public function addGoal(Participant $participant, array $data): ParticipantGoal
public function updateGoal(ParticipantGoal $goal, array $data): ParticipantGoal
public function addDiagnosis(Participant $participant, array $data): ParticipantDiagnosis
```

---

## Task 3: Resources (#[TypeScript])

**ParticipantResource:**
- id, ndis_number, first_name, last_name, full_name, date_of_birth (date string), gender, pronouns, address, suburb, state, postcode, primary_language, interpreter_required, communication_needs, cultural_background, participant_status, created_at

**ParticipantContactResource:**
- id, participant_id, relationship, first_name, last_name, phone, email, is_emergency, is_authorised_rep

**ParticipantGoalResource:**
- id, participant_id, goal_text, category, status, target_date, progress_notes

**ParticipantDiagnosisResource:**
- id, participant_id, diagnosis_name, icd_10_code, diagnosed_date, is_primary

Update `resources/js/types/models.ts` — add Participant, ParticipantContact, ParticipantGoal, ParticipantDiagnosis interfaces.

---

## Task 4: Controllers + FormRequests + Routes

### ParticipantController (standard CRUD)
- index: Participant::with(['contacts','goals','diagnoses'])->latest()->paginate(25)
  - Inertia: 'participants/index', participants (paginated ParticipantResource)
- create: Inertia 'participants/create'
- store: StoreParticipantRequest → participantService->create()
- show: load(['contacts','goals','diagnoses','supportCoordinators.staff']) → Inertia 'participants/show'
- edit: Inertia 'participants/edit', participant
- update: UpdateParticipantRequest → participantService->update()
- destroy: $participant->delete(), redirect with success

### Nested controllers (simple store/destroy in Sheet)
**ParticipantContactController:**
- store(StoreParticipantContactRequest, Participant): creates via service, back()
- destroy(Participant, ParticipantContact): deletes, back()

**ParticipantGoalController:**
- store(StoreParticipantGoalRequest, Participant): creates, back()
- destroy(Participant, ParticipantGoal): deletes, back()

**ParticipantDiagnosisController:**
- store(StoreParticipantDiagnosisRequest, Participant): creates, back()
- destroy(Participant, ParticipantDiagnosis): deletes, back()

### FormRequests
**StoreParticipantRequest:** authorize director|manager|staff_worker. Rules:
- ndis_number: required, string, max:20, unique:participants,ndis_number
- first_name, last_name: required, string, max:255
- date_of_birth: required, date, before:today
- gender: nullable, in:male,female,non_binary,prefer_not_to_say
- pronouns: nullable, string, max:50
- address, suburb, state, postcode, primary_language, communication_needs, cultural_background: nullable, string
- interpreter_required: boolean
- participant_status: required, in:active,inactive,pending

**UpdateParticipantRequest:** Same but ndis_number unique ignores current id.

**StoreParticipantContactRequest:**
- relationship: nullable, string, max:100
- first_name, last_name: required, string, max:255
- phone, email: nullable
- is_emergency, is_authorised_rep: boolean

**StoreParticipantGoalRequest:**
- goal_text: required, text
- category: nullable, string, max:100
- status: required, in:active,completed,on_hold
- target_date: nullable, date
- progress_notes: nullable, text

**StoreParticipantDiagnosisRequest:**
- diagnosis_name: required, string, max:255
- icd_10_code: nullable, string, max:20
- diagnosed_date: nullable, date
- is_primary: boolean

### routes/participants.php
```php
Route::middleware(['auth', 'verified', 'tenant'])->group(function () {
    Route::resource('participants', ParticipantController::class);
    Route::post('participants/{participant}/contacts', [ParticipantContactController::class, 'store'])->name('participants.contacts.store');
    Route::delete('participants/{participant}/contacts/{contact}', [ParticipantContactController::class, 'destroy'])->name('participants.contacts.destroy');
    Route::post('participants/{participant}/goals', [ParticipantGoalController::class, 'store'])->name('participants.goals.store');
    Route::delete('participants/{participant}/goals/{goal}', [ParticipantGoalController::class, 'destroy'])->name('participants.goals.destroy');
    Route::post('participants/{participant}/diagnoses', [ParticipantDiagnosisController::class, 'store'])->name('participants.diagnoses.store');
    Route::delete('participants/{participant}/diagnoses/{diagnosis}', [ParticipantDiagnosisController::class, 'destroy'])->name('participants.diagnoses.destroy');
});
```

Add `require base_path('routes/participants.php');` to the `then:` callback in bootstrap/app.php.

### Tests: `tests/Feature/Director/ParticipantControllerTest.php`
```php
it('director can list participants scoped to tenant')
it('director can create participant')
it('director can view participant show page')
it('director can add contact to participant')
it('director can add goal to participant')
it('staff from other tenant cannot see participants')
```

---

## Task 5: React pages

### participants/index.tsx
DataTable with columns: ndis_number, full_name (Link to show), suburb, state, participant_status (Badge), created_at. AppLayout.

### participants/create.tsx
Form sections: Personal (first_name, last_name, date_of_birth, gender, pronouns), Contact (address, suburb, state, postcode, phone), NDIS (ndis_number, participant_status, primary_language, interpreter_required checkbox, communication_needs, cultural_background). AppLayout.

### participants/edit.tsx
Same form pre-populated. AppLayout.

### participants/show.tsx
Header: full_name, ndis_number, status Badge. Tabs (use ShadCN Tabs):
- **Overview**: personal details Card + NDIS details Card
- **Contacts**: list of ParticipantContact cards + "Add Contact" Sheet with inline form
- **Goals**: list of ParticipantGoal cards + "Add Goal" Sheet
- **Diagnoses**: list of ParticipantDiagnosis cards + "Add Diagnosis" Sheet

AppLayout.

---

## Verification
1. `php artisan test --compact` — all tests pass
2. `php artisan typescript:transform` — Participant types generated
3. `npm run build` — no TS errors
4. Login as director → `/participants` → DataTable renders
5. Create participant → show page with tabs
