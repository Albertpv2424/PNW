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
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\PrizeController;
use App\Http\Controllers\Admin\PromotionController;
use App\Http\Controllers\Admin\StatsController;

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
Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
    // User management
    Route::get('/users', [App\Http\Controllers\Admin\UserController::class, 'index']);
    Route::get('/users/{id}', [App\Http\Controllers\Admin\UserController::class, 'show']);
    Route::post('/users', [App\Http\Controllers\Admin\UserController::class, 'store']);
    Route::put('/users/{id}', [App\Http\Controllers\Admin\UserController::class, 'update']);
    Route::delete('/users/{id}', [App\Http\Controllers\Admin\UserController::class, 'destroy']);
    Route::post('/users/{nick}/balance', [App\Http\Controllers\Admin\UserController::class, 'updateBalance']);
    Route::post('/users/{nick}/role', [App\Http\Controllers\Admin\UserController::class, 'changeRole']);

    // Prize management
    Route::get('/prizes', [App\Http\Controllers\Admin\PrizeController::class, 'index']);
    Route::get('/prizes/{id}', [App\Http\Controllers\Admin\PrizeController::class, 'show']);
    Route::post('/prizes', [App\Http\Controllers\Admin\PrizeController::class, 'store']);
    Route::post('/prizes/{id}', [App\Http\Controllers\Admin\PrizeController::class, 'update']);
    Route::delete('/prizes/{id}', [App\Http\Controllers\Admin\PrizeController::class, 'destroy']);

    // Stats routes
    Route::get('/stats', [App\Http\Controllers\Admin\StatsController::class, 'index']);
    Route::get('/stats/users', [App\Http\Controllers\Admin\StatsController::class, 'userStats']);
    Route::get('/stats/bets', [App\Http\Controllers\Admin\StatsController::class, 'betStats']);
    Route::get('/stats/prizes', [App\Http\Controllers\Admin\StatsController::class, 'prizeStats']);

    // Fix Promotion routes (inside admin group)
    Route::get('/promotions', [PromotionController::class, 'index']);
    Route::get('/promotions/{id}', [PromotionController::class, 'show']);
    Route::post('/promotions', [PromotionController::class, 'store']);
    Route::post('/promotions/{id}', [PromotionController::class, 'update']);
    Route::delete('/promotions/{id}', [PromotionController::class, 'destroy']);
    // Inside your admin routes group
    Route::get('/tipos-promocion', [PromotionController::class, 'getTiposPromocion']);
});

// The following routes should be outside the admin group
// Debug route to check user role
Route::middleware('auth:sanctum')->get('/debug/user-role', function (Request $request) {
    $user = $request->user();
    return response()->json([
        'authenticated' => $user ? true : false,
        'user' => $user ? [
            'nick' => $user->nick,
            'tipus_acc' => $user->tipus_acc,
            'is_admin_check' => in_array(strtolower($user->tipus_acc), ['admin', 'administrador', 'administrator'])
        ] : null
    ]);
});

// Add these routes for bet verification
Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    // Bet verification routes
    Route::get('/bets/pending', [App\Http\Controllers\Admin\BetVerificationController::class, 'getPendingBets']);
    Route::get('/bets/verified', [App\Http\Controllers\Admin\BetVerificationController::class, 'getVerifiedBets']);
    Route::post('/bets/{id}/verify', [App\Http\Controllers\Admin\BetVerificationController::class, 'verifyBet']);
});

// Add these routes to your existing api.php file
Route::middleware('auth:sanctum')->group(function () {
    // User bets routes
    Route::get('/user/bets/active', 'App\Http\Controllers\BetController@getUserActiveBets');
    Route::get('/user/bets/history', 'App\Http\Controllers\BetController@getUserBetHistory');
    Route::get('/user/bets/stats', 'App\Http\Controllers\BetController@getUserBetStats');
});
