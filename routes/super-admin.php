<?php

use App\Http\Controllers\SuperAdmin\PermissionController;
use App\Http\Controllers\SuperAdmin\PlatformAdminController;
use App\Http\Controllers\SuperAdmin\RoleController;
use App\Http\Controllers\SuperAdmin\TenantController;
use Illuminate\Support\Facades\Route;

Route::prefix('super-admin')
    ->name('super-admin.')
    ->middleware(['auth', 'super_admin'])
    ->group(function () {
        Route::resource('tenants', TenantController::class)
            ->only(['index', 'create', 'store', 'edit', 'update', 'destroy']);
        Route::patch('tenants/{tenant}/suspend', [TenantController::class, 'suspend'])->name('tenants.suspend');
        Route::patch('tenants/{tenant}/activate', [TenantController::class, 'activate'])->name('tenants.activate');

        Route::get('platform-admins', [PlatformAdminController::class, 'index'])->name('platform-admins.index');
        Route::post('platform-admins', [PlatformAdminController::class, 'store'])->name('platform-admins.store');
        Route::delete('platform-admins/{platformAdmin}', [PlatformAdminController::class, 'destroy'])->name('platform-admins.destroy');

        Route::get('roles', [RoleController::class, 'index'])->name('roles.index');
        Route::post('roles', [RoleController::class, 'store'])->name('roles.store');
        Route::put('roles/{role}', [RoleController::class, 'update'])->name('roles.update');
        Route::delete('roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');

        Route::post('permissions', [PermissionController::class, 'store'])->name('permissions.store');
        Route::delete('permissions/{permission}', [PermissionController::class, 'destroy'])->name('permissions.destroy');
    });
