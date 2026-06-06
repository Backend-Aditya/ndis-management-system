<?php

use App\Http\Controllers\Director\AnnouncementController;
use App\Http\Controllers\Director\AuditLogController;
use App\Http\Controllers\Director\MessageController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'tenant'])->group(function () {
    Route::resource('messages', MessageController::class)
        ->only(['index', 'create', 'store', 'show', 'destroy']);

    Route::resource('announcements', AnnouncementController::class)
        ->only(['index', 'create', 'store', 'destroy']);
    Route::patch('announcements/{announcement}/toggle-pin', [AnnouncementController::class, 'togglePin'])
        ->name('announcements.toggle-pin');

    Route::get('audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
});
