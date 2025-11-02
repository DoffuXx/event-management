<?php

use App\Http\Controllers\EventController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EventRegistrationController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [EventController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

Route::prefix('events')->name('events.')->group(function () {
        // View single event
Route::get('/{eventId}', [EventController::class, 'show'])->name('show');
        // Join event (register)
                Route::post('/{eventId}/join', [EventRegistrationController::class, 'store'])
            ->middleware('check.event.capacity')
            ->name('join');

                Route::post('/{eventId}/cancel', [EventRegistrationController::class, 'destroy'])
            ->name('cancel');


    });

});


require __DIR__.'/auth.php';
