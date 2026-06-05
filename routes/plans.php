<?php

use App\Http\Controllers\Director\PlanController;
use App\Http\Controllers\Director\PlanManagerController;
use App\Http\Controllers\Director\PlanSupportCategoryController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'tenant'])->group(function () {
    Route::resource('plans', PlanController::class);

    Route::post('plans/{plan}/categories', [PlanSupportCategoryController::class, 'store'])
        ->name('plans.categories.store');
    Route::delete('plans/{plan}/categories/{category}', [PlanSupportCategoryController::class, 'destroy'])
        ->name('plans.categories.destroy');

    Route::post('plans/{plan}/managers', [PlanManagerController::class, 'store'])
        ->name('plans.managers.store');
    Route::delete('plans/{plan}/managers/{manager}', [PlanManagerController::class, 'destroy'])
        ->name('plans.managers.destroy');
});
