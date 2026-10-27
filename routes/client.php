<?php
use Illuminate\Support\Facades\Route;

Route::inertia('dashboard', 'client/dashboard')->name('dashboard');

Route::prefix('documents')->name('documents.')->group(function () {
    Route::inertia('/', 'client/documents/index')->name('index');
});
