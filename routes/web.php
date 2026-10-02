<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderRekapController;

Route::redirect('/', '/login')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
<<<<<<< HEAD
    Route::get('/dashboard', [DashboardController::class, 'orderDashboard'])
=======
    Route::get('/dashboard', [DashboardController::class, 'cardUp'])
>>>>>>> 37ac52e (dynamic data card orderan)
    ->name('dashboard');
});

require __DIR__.'/settings.php';
