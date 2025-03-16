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

// Add this route to your api.php file
Route::middleware('auth:sanctum')->get('/user/premios', [App\Http\Controllers\PremioController::class, 'userPremios']);

// Add these routes to your api.php file
Route::post('/request-password-reset', [App\Http\Controllers\AuthController::class, 'requestPasswordReset']);
Route::post('/reset-password-with-token', [App\Http\Controllers\AuthController::class, 'resetPasswordWithToken']);

// Add this at the top of your routes file
Route::options('/{any}', function() {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', 'http://localhost:4200')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
})->where('any', '.*');

// Cambia la ruta de delete-account para que acepte el método DELETE
Route::middleware('auth:sanctum')->delete('/delete-account', [App\Http\Controllers\AuthController::class, 'deleteAccount']);

// Alternativamente, si el método DELETE sigue dando problemas, podemos usar POST con un parámetro _method
Route::middleware('auth:sanctum')->post('/delete-account', [App\Http\Controllers\AuthController::class, 'deleteAccount']);
