<?php

use App\Models\Message;
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

it('director can list messages scoped to tenant', function () {
    Message::factory()->forTenant($this->tenant)->count(3)->create();
    $other = Tenant::factory()->create();
    Message::factory()->forTenant($other)->create();

    $this->actingAs($this->director)
        ->get('/messages')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('communications/messages/index')
            ->has('messages.data', 3));
});

it('director can send a direct message with recipients', function () {
    $recipient = User::factory()->forTenant($this->tenant)->create();
    $recipient->assignRole('staff_worker');

    $this->actingAs($this->director)
        ->post('/messages', [
            'subject' => 'Team update',
            'body' => 'Please read.',
            'message_type' => 'general',
            'is_broadcast' => false,
            'recipient_ids' => [$recipient->id],
        ])
        ->assertRedirect('/messages');

    $message = Message::withoutGlobalScopes()->where('tenant_id', $this->tenant->id)->first();
    expect($message)->not->toBeNull()
        ->and($message->sender_id)->toBe($this->director->id);
    $this->assertDatabaseHas('message_recipients', ['message_id' => $message->id, 'recipient_id' => $recipient->id]);
});

it('broadcast message goes to all tenant users', function () {
    User::factory()->forTenant($this->tenant)->count(3)->create()->each->assignRole('staff_worker');

    $this->actingAs($this->director)
        ->post('/messages', [
            'subject' => 'All hands',
            'body' => 'Broadcast.',
            'message_type' => 'urgent',
            'is_broadcast' => true,
        ])
        ->assertRedirect('/messages');

    $message = Message::withoutGlobalScopes()->where('tenant_id', $this->tenant->id)->first();
    // 3 staff + director = 4 users, minus sender (director) = 3 recipients
    expect($message->recipients()->count())->toBe(3);
});

it('director can publish an announcement', function () {
    $this->actingAs($this->director)
        ->post('/announcements', [
            'title' => 'Office closed',
            'content' => 'Public holiday Monday.',
            'audience' => 'all_staff',
            'is_pinned' => true,
        ])
        ->assertRedirect('/announcements');

    $this->assertDatabaseHas('announcements', [
        'title' => 'Office closed',
        'tenant_id' => $this->tenant->id,
        'created_by' => $this->director->id,
    ]);
});
