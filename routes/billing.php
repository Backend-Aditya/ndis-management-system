<?php

use App\Http\Controllers\Director\InvoiceController;
use App\Http\Controllers\Director\NdisClaimController;
use App\Http\Controllers\Director\PaymentController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'tenant'])->group(function () {
    Route::resource('invoices', InvoiceController::class)
        ->only(['index', 'create', 'store', 'show', 'destroy']);
    Route::post('invoices/{invoice}/mark-sent', [InvoiceController::class, 'markSent'])->name('invoices.mark-sent');
    Route::post('invoices/{invoice}/payments', [InvoiceController::class, 'addPayment'])->name('invoices.payments.store');
    Route::post('invoices/{invoice}/claim', [InvoiceController::class, 'createClaim'])->name('invoices.claim.store');

    Route::get('claims', [NdisClaimController::class, 'index'])->name('claims.index');
    Route::patch('claims/{claim}/submit', [NdisClaimController::class, 'submit'])->name('claims.submit');
    Route::delete('claims/{claim}', [NdisClaimController::class, 'destroy'])->name('claims.destroy');

    Route::get('payments', [PaymentController::class, 'index'])->name('payments.index');
});
