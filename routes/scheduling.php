<?php

use App\Http\Controllers\Director\LeaveRequestController;
use App\Http\Controllers\Director\ShiftController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'tenant'])->group(function () {
    Route::resource('shifts', ShiftController::class);
    Route::post('shifts/{shift}/cancel', [ShiftController::class, 'cancel'])->name('shifts.cancel');
    Route::post('shifts/{shift}/handover', [ShiftController::class, 'addHandover'])->name('shifts.handover');

    Route::get('leave', [LeaveRequestController::class, 'index'])->name('leave.index');
    Route::get('leave/create', [LeaveRequestController::class, 'create'])->name('leave.create');
    Route::post('leave', [LeaveRequestController::class, 'store'])->name('leave.store');
    Route::patch('leave/{leave}/approve', [LeaveRequestController::class, 'approve'])->name('leave.approve');
    Route::patch('leave/{leave}/reject', [LeaveRequestController::class, 'reject'])->name('leave.reject');
    Route::delete('leave/{leave}', [LeaveRequestController::class, 'destroy'])->name('leave.destroy');
});
