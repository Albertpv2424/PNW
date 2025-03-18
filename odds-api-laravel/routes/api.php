<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventoController;
use App\Http\Controllers\ApuestaController;
use App\Http\Controllers\PremioController;
use App\Http\Controllers\PromocionController;
use App\Http\Controllers\DailyWheelController;
use App\Http\Controllers\VideoRewardsController;
use App\Http\Controllers\OddsController;
use App\Http\Controllers\AdminController;

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

// Añade esta ruta junto con las demás rutas protegidas por auth:sanctum

Route::middleware('auth:sanctum')->post('/add-points', [AuthController::class, 'addPoints']);

// Daily Wheel routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/daily-wheel/spin', [DailyWheelController::class, 'spin']);
    Route::get('/daily-wheel/status', [DailyWheelController::class, 'checkStatus']);
    
    Route::post('/video-rewards/add-points', [VideoRewardsController::class, 'addPoints']);
    Route::get('/video-rewards/status', [VideoRewardsController::class, 'checkStatus']);
});
// Add this line to your existing routes
Route::get('/search', [App\Http\Controllers\SearchController::class, 'search']);

// Add this route for handling bet submissions
Route::middleware('auth:sanctum')->post('/apuestas', [ApuestaController::class, 'registrarApuesta']);

// Admin routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // User management
    Route::get('/users', [AdminController::class, 'getUsers']);
    Route::get('/users/{id}', [AdminController::class, 'getUser']);
    Route::post('/users', [AdminController::class, 'createUser']);
    Route::put('/users/{id}', [AdminController::class, 'updateUser']);
    Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
    Route::post('/users/{id}/balance', [AdminController::class, 'updateUserBalance']);
    Route::post('/users/{id}/role', [AdminController::class, 'changeUserRole']);
    
    // Stats
    Route::get('/stats', [AdminController::class, 'getStats']);
});

// Add these routes to your existing api.php file

// Prize management routes
Route::get('/admin/prizes', [AdminController::class, 'getPrizes']);
Route::get('/admin/prizes/{id}', [AdminController::class, 'getPrize']);
Route::post('/admin/prizes', [AdminController::class, 'createPrize']);
Route::post('/admin/prizes/{id}', [AdminController::class, 'updatePrize']);
Route::delete('/admin/prizes/{id}', [AdminController::class, 'deletePrize']);
