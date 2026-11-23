<?php

use App\Http\Controllers\Client\AssetController;
use App\Http\Controllers\Client\DashboardController;
use App\Http\Controllers\Client\DocumentTemplateController;
use App\Http\Controllers\Client\DocumentController;
use App\Http\Controllers\Client\FleetController;
use Illuminate\Support\Facades\Route;

Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

Route::prefix('documents')->name('documents.')->group(function () {
    Route::get('/', [DocumentController::class, 'index'])->name('index');
    Route::get('/{document}/download', [DocumentController::class, 'download'])->name('download');
    Route::get('/{document}/preview', [DocumentController::class, 'preview'])->name('preview');
    Route::get('/create/{documentTemplate}', [DocumentController::class, 'create'])->name('create');
    Route::post('/{documentTemplate}', [DocumentController::class, 'store'])->name('store');
});

Route::prefix('templates')->name('templates.')->group(function () {
    Route::get('/', [DocumentTemplateController::class, 'index'])->name('index');
    Route::get('/create', [DocumentTemplateController::class, 'create'])->name('create');
    Route::post('/', [DocumentTemplateController::class, 'store'])->name('store');
    Route::get('/{documentTemplate}/edit', [DocumentTemplateController::class, 'edit'])->name('edit');
    Route::put('/{documentTemplate}', [DocumentTemplateController::class, 'update'])->name('update');
    Route::get('/{documentTemplate}/download', [DocumentTemplateController::class, 'download'])->name('download');
    Route::delete('/{documentTemplate}', [DocumentTemplateController::class, 'destroy'])->name('destroy');
});

Route::prefix('assets')->name('assets.')->group(function () {
    Route::get('/', [AssetController::class, 'index'])->name('index');
    Route::get('/create', [AssetController::class, 'create'])->name('create');
    Route::post('/', [AssetController::class, 'store'])->name('store');
    Route::get('{asset}/edit', [AssetController::class, 'edit'])->name('edit');
    Route::put('{asset}', [AssetController::class, 'update'])->name('update');
    Route::delete('{asset}', [AssetController::class, 'destroy'])->name('destroy');
});

Route::prefix('fleet')->name('fleet.')->group(function () {
    Route::get('/', [FleetController::class, 'index'])->name('index');
});
