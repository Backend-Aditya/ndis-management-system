<?php

use App\Models\Announcement;
use App\Models\AuditLog;
use App\Models\Message;
use App\Models\MessageRecipient;
use App\Models\Tenant;
use Database\Seeders\RoleSeeder;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->tenant = Tenant::factory()->create();
    app()->instance('tenant', $this->tenant);
});

it('message scoped to tenant via HasTenant', function () {
    Message::factory()->forTenant($this->tenant)->count(2)->create();
    $other = Tenant::factory()->create();
    Message::factory()->forTenant($other)->create();

    expect(Message::count())->toBe(2);
});

it('message has recipients', function () {
    $message = Message::factory()->forTenant($this->tenant)->create();
    MessageRecipient::factory()->count(3)->create(['message_id' => $message->id]);

    expect($message->recipients)->toHaveCount(3);
});

it('announcement and audit log scoped to tenant', function () {
    Announcement::factory()->forTenant($this->tenant)->count(2)->create();
    AuditLog::factory()->forTenant($this->tenant)->create();

    $other = Tenant::factory()->create();
    Announcement::factory()->forTenant($other)->create();

    expect(Announcement::count())->toBe(2)
        ->and(AuditLog::count())->toBe(1);
});
