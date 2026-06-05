<?php

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Laravel\Fortify\Features;

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::registration());
    $this->seed(RoleSeeder::class);
});

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

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

    $user = User::withoutGlobalScopes()->where('email', 'jane@sunrise.com.au')->first();
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
