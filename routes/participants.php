<?php

use App\Http\Controllers\Director\ParticipantContactController;
use App\Http\Controllers\Director\ParticipantController;
use App\Http\Controllers\Director\ParticipantDiagnosisController;
use App\Http\Controllers\Director\ParticipantGoalController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'tenant'])->group(function () {
    Route::resource('participants', ParticipantController::class);

    Route::post('participants/{participant}/contacts', [ParticipantContactController::class, 'store'])
        ->name('participants.contacts.store');
    Route::delete('participants/{participant}/contacts/{contact}', [ParticipantContactController::class, 'destroy'])
        ->name('participants.contacts.destroy');

    Route::post('participants/{participant}/goals', [ParticipantGoalController::class, 'store'])
        ->name('participants.goals.store');
    Route::delete('participants/{participant}/goals/{goal}', [ParticipantGoalController::class, 'destroy'])
        ->name('participants.goals.destroy');

    Route::post('participants/{participant}/diagnoses', [ParticipantDiagnosisController::class, 'store'])
        ->name('participants.diagnoses.store');
    Route::delete('participants/{participant}/diagnoses/{diagnosis}', [ParticipantDiagnosisController::class, 'destroy'])
        ->name('participants.diagnoses.destroy');
});
