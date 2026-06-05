<?php

use Illuminate\Support\Facades\Route;

// SuperAdmin routes — implemented in Task 9
Route::prefix('super-admin')->middleware(['auth', 'super_admin'])->group(function () {
    Route::get('tenants', fn () => response()->json([]))->name('super-admin.tenants.index');
});
