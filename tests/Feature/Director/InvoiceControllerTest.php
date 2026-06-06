<?php

use App\Models\Invoice;
use App\Models\NdisPlan;
use App\Models\Participant;
use App\Models\ServiceType;
use App\Models\Tenant;
use App\Models\User;
use Database\Seeders\RoleSeeder;

beforeEach(function () {
    $this->withoutVite();
    $this->seed(RoleSeeder::class);
    $this->tenant = Tenant::factory()->create();
    $this->director = User::factory()->forTenant($this->tenant)->create();
    $this->director->assignRole('director');
    app()->instance('tenant', $this->tenant);
});

it('director can list invoices scoped to tenant', function () {
    Invoice::factory()->forTenant($this->tenant)->count(3)->create();
    $other = Tenant::factory()->create();
    Invoice::factory()->forTenant($other)->create();

    $this->actingAs($this->director)
        ->get('/invoices')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('billing/invoices/index')
            ->has('invoices.data', 3));
});

it('director can create invoice with line items and computed totals', function () {
    $participant = Participant::factory()->forTenant($this->tenant)->create();
    $plan = NdisPlan::factory()->forTenant($this->tenant)->forParticipant($participant)->create();
    $serviceType = ServiceType::factory()->forTenant($this->tenant)->create();

    $this->actingAs($this->director)
        ->post('/invoices', [
            'participant_id' => $participant->id,
            'plan_id' => $plan->id,
            'invoice_date' => now()->toDateString(),
            'line_items' => [
                [
                    'service_type_id' => $serviceType->id,
                    'description' => 'Support work',
                    'service_date' => now()->toDateString(),
                    'quantity' => 10,
                    'unit_price' => 50,
                ],
            ],
        ])
        ->assertRedirect();

    $invoice = Invoice::withoutGlobalScopes()->where('tenant_id', $this->tenant->id)->first();
    expect($invoice)->not->toBeNull()
        ->and((float) $invoice->subtotal)->toBe(500.0)
        ->and((float) $invoice->gst_amount)->toBe(50.0)
        ->and((float) $invoice->total_amount)->toBe(550.0);
    $this->assertDatabaseHas('invoice_line_items', ['invoice_id' => $invoice->id, 'description' => 'Support work']);
});

it('director can record payment and invoice marked paid when fully covered', function () {
    $invoice = Invoice::factory()->forTenant($this->tenant)->create([
        'total_amount' => 550, 'status' => 'sent',
    ]);

    $this->actingAs($this->director)
        ->post("/invoices/{$invoice->id}/payments", [
            'amount' => 550,
            'payment_method' => 'bank_transfer',
            'payment_date' => now()->toDateString(),
            'status' => 'completed',
        ])
        ->assertRedirect();

    expect($invoice->fresh()->status)->toBe('paid');
    $this->assertDatabaseHas('payments', ['invoice_id' => $invoice->id, 'amount' => 550]);
});

it('director can create claim for invoice', function () {
    $invoice = Invoice::factory()->forTenant($this->tenant)->create(['total_amount' => 550]);

    $this->actingAs($this->director)
        ->post("/invoices/{$invoice->id}/claim", [
            'claim_type' => 'standard',
            'claim_period_start' => now()->subMonth()->toDateString(),
            'claim_period_end' => now()->toDateString(),
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('ndis_claims', ['invoice_id' => $invoice->id, 'tenant_id' => $this->tenant->id]);
});
