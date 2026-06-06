<?php

use App\Http\Controllers\Director\AuditController;
use App\Http\Controllers\Director\BehaviourSupportPlanController;
use App\Http\Controllers\Director\IncidentController;
use App\Http\Controllers\Director\RiskAssessmentController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'tenant'])->group(function () {
    Route::resource('incidents', IncidentController::class)
        ->only(['index', 'create', 'store', 'show', 'destroy']);
    Route::post('incidents/{incident}/follow-ups', [IncidentController::class, 'addFollowUp'])->name('incidents.follow-ups.store');

    Route::resource('risk-assessments', RiskAssessmentController::class)
        ->only(['index', 'create', 'store', 'destroy']);

    Route::resource('behaviour-support-plans', BehaviourSupportPlanController::class)
        ->only(['index', 'create', 'store', 'destroy']);

    Route::resource('audits', AuditController::class)
        ->only(['index', 'create', 'store', 'destroy']);
});
