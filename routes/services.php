<?php

use App\Http\Controllers\Director\ServiceAgreementController;
use App\Http\Controllers\Director\ServiceTypeController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'tenant'])->group(function () {
    Route::resource('service-types', ServiceTypeController::class)
        ->only(['index', 'create', 'store', 'edit', 'update', 'destroy']);

    Route::resource('service-agreements', ServiceAgreementController::class)
        ->only(['index', 'create', 'store', 'show', 'destroy']);
});
