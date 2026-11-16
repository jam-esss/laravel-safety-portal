<?php

use App\Models\User;

test('guests visiting the home page are redirected to login', function () {
    $response = $this->get(route('home'));

    $response->assertRedirect(route('login'));
});

test('logged in users visiting the home page are redirected to the dashboard', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('home'));

    $response->assertRedirect(route('client.dashboard'));
});
