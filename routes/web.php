<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('client.dashboard');
    }

    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->name('client.')->group(function () {
    require __DIR__ . '/client.php';
});

Route::middleware(['auth', 'verified'])->name('office.')->prefix('office')->group(function () {
    require __DIR__ . '/office.php';
});

require __DIR__ . '/settings.php';
