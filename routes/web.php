<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderRekapController;

Route::redirect('/', '/login')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'cardUp'])
    ->name('dashboard');
});

Route::get('/order-rekap', [OrderRekapController::class, 'index'])
    ->middleware('auth')
    ->name('order-rekap.index');

require __DIR__.'/settings.php';
