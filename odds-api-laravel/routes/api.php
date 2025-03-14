<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OddsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PremioController;
use App\Http\Controllers\PromocionController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/sports', [OddsController::class, 'getSportsJson']);
Route::get('/odds/{sportKey}', [OddsController::class, 'getOddsJson']);

Route::post('/register', [AuthController::class, 'register']);
// Add the login route
Route::post('/login', [AuthController::class, 'login']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Añadir esta ruta para la actualización del perfil
// Cambiar esta línea
// Route::middleware('auth:sanctum')->post('/update-profile', [AuthController::class, 'updateProfile']);

// Por esta línea (sin middleware de autenticación)
Route::post('/update-profile', [AuthController::class, 'updateProfile']);

// Rutas para premios
Route::get('/premios', [PremioController::class, 'index']);
Route::get('/premios/{id}', [PremioController::class, 'show']);
Route::post('/premios/{id}/canjear', [PremioController::class, 'canjear'])->middleware('auth:sanctum');

// Rutas para promociones
Route::get('/promociones', [PromocionController::class, 'index']);
Route::get('/promociones/{id}', [PromocionController::class, 'show']);
Route::post('/promociones/{id}/inscribir', [PromocionController::class, 'inscribir'])->middleware('auth:sanctum');
