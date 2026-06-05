<?php

use App\Http\Controllers\Director\StaffController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'tenant'])->group(function () {
    Route::resource('staff', StaffController::class);
});
