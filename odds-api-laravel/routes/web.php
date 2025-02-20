<?php

use App\Http\Controllers\OddsController;
use Illuminate\Support\Facades\Route;

Route::get('/', [OddsController::class, 'index'])->name('sports.index');
Route::get('/odds/{sportKey}', [OddsController::class, 'show'])->name('odds.show');

Route::get('{any}', function () {
    return view('index');
})->where('any', '.*');