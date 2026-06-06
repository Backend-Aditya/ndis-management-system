<?php

use App\Models\Invoice;
use App\Models\InvoiceLineItem;
use App\Models\NdisClaim;
use App\Models\Payment;
use App\Models\Tenant;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->tenant = Tenant::factory()->create();
    app()->instance('tenant', $this->tenant);
});

it('invoice scoped to tenant via HasTenant', function () {
    Invoice::factory()->forTenant($this->tenant)->count(2)->create();
    $other = Tenant::factory()->create();
    Invoice::factory()->forTenant($other)->create();

    expect(Invoice::count())->toBe(2);
});

it('invoice has line items and payments', function () {
    $invoice = Invoice::factory()->forTenant($this->tenant)->create();
    InvoiceLineItem::factory()->count(3)->create(['invoice_id' => $invoice->id]);
    Payment::factory()->count(2)->create(['invoice_id' => $invoice->id]);

    expect($invoice->lineItems)->toHaveCount(3)
        ->and($invoice->payments)->toHaveCount(2);
});

it('ndis claim scoped to tenant', function () {
    NdisClaim::factory()->forTenant($this->tenant)->count(2)->create();
    $other = Tenant::factory()->create();
    NdisClaim::factory()->forTenant($other)->create();

    expect(NdisClaim::count())->toBe(2);
});
