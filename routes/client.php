<?php

use App\Http\Controllers\Client\DocumentTemplateController;
use Illuminate\Support\Facades\Route;

Route::inertia('dashboard', 'client/dashboard')->name('dashboard');

Route::prefix('templates')->name('templates.')->group(function () {
    Route::get('/', [DocumentTemplateController::class, 'index'])->name('index');
    Route::get('/create', [DocumentTemplateController::class, 'create'])->name('create');
    Route::post('/', [DocumentTemplateController::class, 'store'])->name('store');
    Route::get('/{documentTemplate}/edit', [DocumentTemplateController::class, 'edit'])->name('edit');
    Route::put('/{documentTemplate}', [DocumentTemplateController::class, 'update'])->name('update');
});
