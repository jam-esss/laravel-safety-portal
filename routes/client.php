<?php

use App\Http\Controllers\Client\DocumentTemplateController;
use Illuminate\Support\Facades\Route;

Route::inertia('dashboard', 'client/dashboard')->name('dashboard');

Route::prefix('documents')->name('documents.')->group(function () {
    Route::get('/', [DocumentTemplateController::class, 'index'])->name('index');
    Route::get('/create', [DocumentTemplateController::class, 'create'])->name('create');
});
