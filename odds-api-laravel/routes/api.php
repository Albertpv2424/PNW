<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventoController;
use App\Http\Controllers\ApuestaController;
// use App\Http\Controllers\PromocionController; // Comentamos esta línea
use App\Http\Controllers\DailyWheelController;
use App\Http\Controllers\VideoRewardsController;
use App\Http\Controllers\OddsController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\PrizeController;
use App\Http\Controllers\Admin\PromotionController;
use App\Http\Controllers\Admin\StatsController;
use App\Http\Controllers\Admin\BetVerificationController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\PremiosController;
use App\Http\Controllers\PromocionesController;

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

// CORS preflight
Route::options('/{any}', function() {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', 'http://localhost:4200')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
})->where('any', '.*');

// Rutas públicas
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/sports', [OddsController::class, 'getSportsJson']);
Route::get('/odds/{sportKey}', [OddsController::class, 'getOddsJson']);
Route::get('/search', [App\Http\Controllers\SearchController::class, 'search']);

// Autenticación
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/update-profile', [AuthController::class, 'updateProfile']);
Route::post('/request-password-reset', [AuthController::class, 'requestPasswordReset']);
Route::post('/reset-password-with-token', [AuthController::class, 'resetPasswordWithToken']);

// Rutas para premios (acceso público)
Route::get('/premios', [PremiosController::class, 'index']);
Route::get('/premios/{id}', [PremiosController::class, 'show']);

// Comentamos estas rutas ya que las reemplazamos por las de abajo
// Route::get('/promociones', [PromocionController::class, 'index']);
// Route::get('/promociones/{id}', [PromocionController::class, 'show']);

// Rutas para promociones (acceso público)
Route::get('/promociones', [PromocionesController::class, 'index']);
Route::get('/promociones/{id}', [PromocionesController::class, 'show']);
Route::post('/promociones/{id}/inscribir', [PromocionesController::class, 'inscribir'])->middleware('auth:sanctum');
// Add this route for the welcome bonus
Route::post('/promociones/bono-bienvenida', [PromocionesController::class, 'inscribirBonoBienvenida'])->middleware('auth:sanctum');
Route::get('/user/promociones', [PromocionesController::class, 'userInscripciones'])->middleware('auth:sanctum');

// Rutas protegidas por autenticación
Route::middleware('auth:sanctum')->group(function () {
    // Cuenta de usuario
    Route::delete('/delete-account', [AuthController::class, 'deleteAccount']);
    Route::post('/delete-account', [AuthController::class, 'deleteAccount']); // Alternativa para DELETE
    Route::post('/add-points', [AuthController::class, 'addPoints']);

    // Premios de usuario - Ahora usando PremiosController
    Route::post('/premios/{id}/canjear', [PremiosController::class, 'canjear']);
    Route::get('/user/premios', [PremiosController::class, 'userPremios']);
    Route::get('/user/premios/translated', [PremiosController::class, 'userPremiosTranslated']);

    // Promociones de usuario
    Route::post('/promociones/{id}/inscribir', [PromocionesController::class, 'inscribir']);

    // Daily Wheel y Video Rewards
    Route::post('/daily-wheel/spin', [DailyWheelController::class, 'spin']);
    Route::get('/daily-wheel/status', [DailyWheelController::class, 'checkStatus']);
    Route::post('/video-rewards/add-points', [VideoRewardsController::class, 'addPoints']);
    Route::get('/video-rewards/status', [VideoRewardsController::class, 'checkStatus']);

    // Apuestas de usuario
    Route::post('/apuestas', [ApuestaController::class, 'registrarApuesta']);
    Route::get('/user/bets/active', 'App\Http\Controllers\BetController@getUserActiveBets');
    Route::get('/user/bets/history', 'App\Http\Controllers\BetController@getUserBetHistory');
    Route::get('/user/bets/stats', 'App\Http\Controllers\BetController@getUserBetStats');

    // Ruta de depuración
    Route::get('/debug/user-role', function (Request $request) {
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
});

// Rutas de administración (requieren autenticación y rol de administrador)
// En el grupo de rutas de administrador
Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
    // Gestión de usuarios
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::post('/users/{nick}/balance', [UserController::class, 'updateBalance']);
    Route::post('/users/{nick}/role', [UserController::class, 'changeRole']);
    Route::delete('/users/{nick}/delete-all-data', [UserController::class, 'deleteAllData']);

    // Gestión de premios
    Route::get('/prizes', [PrizeController::class, 'index']);
    Route::get('/prizes/{id}', [PrizeController::class, 'show']);
    Route::post('/prizes', [PrizeController::class, 'store']);
    Route::post('/prizes/{id}', [PrizeController::class, 'update']);
    Route::delete('/prizes/{id}', [PrizeController::class, 'destroy']);

    // Verificación de premios canjeados
    Route::get('/prize-redemptions', [PrizeController::class, 'getRedemptions']);
    Route::post('/prize-redemptions/{id}/verify', [PrizeController::class, 'verifyRedemption']);

    // Gestión de promociones
    Route::get('/promotions', [PromotionController::class, 'index']);
    Route::get('/promotions/{id}', [PromotionController::class, 'show']);
    Route::post('/promotions', [PromotionController::class, 'store']);
    Route::post('/promotions/{id}', [PromotionController::class, 'update']);
    Route::delete('/promotions/{id}', [PromotionController::class, 'destroy']);
    Route::get('/tipos-promocion', [PromotionController::class, 'getTiposPromocion']);

    // Verificación de apuestas
    Route::get('/bets/pending', [BetVerificationController::class, 'getPendingBets']);
    Route::get('/bets/verified', [BetVerificationController::class, 'getVerifiedBets']);
    Route::post('/bets/{id}/verify', [BetVerificationController::class, 'verifyBet']);

    // Estadísticas
    Route::get('/stats', [StatsController::class, 'index']);
    Route::get('/stats/users', [StatsController::class, 'userStats']);
    Route::get('/stats/bets', [StatsController::class, 'betStats']);
    Route::get('/stats/prizes', [StatsController::class, 'prizeStats']);

    // Gestión de limitaciones de usuarios
    Route::get('/user-limitations', 'App\Http\Controllers\Admin\UserLimitationsController@getAllUsersLimitations');
    Route::get('/user-limitations/{username}', 'App\Http\Controllers\Admin\UserLimitationsController@getUserLimitations');
    Route::put('/user-limitations/{username}', 'App\Http\Controllers\Admin\UserLimitationsController@updateUserLimitations');
    Route::post('/user-limitations/{username}/reset', 'App\Http\Controllers\Admin\UserLimitationsController@resetUserLimitations');
    Route::put('/user-limitations/{username}/toggle', 'App\Http\Controllers\Admin\UserLimitationsController@toggleUserLimitations');
    Route::get('/user-limitations/defaults', 'App\Http\Controllers\Admin\UserLimitationsController@getDefaultLimitations');
    Route::post('/user-limitations/global', 'App\Http\Controllers\Admin\UserLimitationsController@setGlobalLimitations');
});

// Añade esta ruta junto a tus otras rutas de API
Route::get('/check-translations', [PremiosController::class, 'checkTranslations']);
// Contact form route
// Update the contact route to use the same endpoint
Route::post('/contact', [App\Http\Controllers\ContactController::class, 'sendContactForm']);

// Rutas para el chat en vivo (requieren autenticación)
// Add these routes if they don't exist
Route::middleware('auth:sanctum')->group(function () {
    // Chat routes
    Route::post('/chat/start', [ChatController::class, 'startSession']);
    Route::post('/chat/messages', [ChatController::class, 'sendMessage']);
    Route::get('/chat/messages/{sessionId}', [ChatController::class, 'getMessages']);
    Route::get('/chat/read/{sessionId}', [ChatController::class, 'markAsRead']);
    Route::get('/chat/sessions', [ChatController::class, 'getActiveSessions']);
    // Rutas para administración de chat
    Route::delete('/chat/sessions/{sessionId}', [ChatController::class, 'deleteSession'])->middleware('auth:sanctum');
    Route::delete('/chat/sessions/old/{days?}', [ChatController::class, 'deleteOldSessions'])->middleware('auth:sanctum');
});
// Admin routes
Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
    // User management
    Route::get('/users', 'App\Http\Controllers\Admin\UserController@index');
    Route::get('/users/{id}', 'App\Http\Controllers\Admin\UserController@show');
    Route::post('/users', 'App\Http\Controllers\Admin\UserController@store');
    Route::put('/users/{id}', 'App\Http\Controllers\Admin\UserController@update');
    Route::delete('/users/{id}', 'App\Http\Controllers\Admin\UserController@destroy');
    Route::post('/users/{id}/balance', 'App\Http\Controllers\Admin\UserController@updateBalance');
    Route::delete('/users/{id}/delete-all-data', 'App\Http\Controllers\Admin\UserController@deleteAllData');

    // Gestión de premios
    Route::get('/prizes', [PrizeController::class, 'index']);
    Route::get('/prizes/{id}', [PrizeController::class, 'show']);
    Route::post('/prizes', [PrizeController::class, 'store']);
    Route::post('/prizes/{id}', [PrizeController::class, 'update']);
    Route::delete('/prizes/{id}', [PrizeController::class, 'destroy']);

    // Verificación de premios canjeados
    Route::get('/prize-redemptions', [PrizeController::class, 'getRedemptions']);
    Route::post('/prize-redemptions/{id}/verify', [PrizeController::class, 'verifyRedemption']);

    // Gestión de promociones
    Route::get('/promotions', [PromotionController::class, 'index']);
    Route::get('/promotions/{id}', [PromotionController::class, 'show']);
    Route::post('/promotions', [PromotionController::class, 'store']);
    Route::post('/promotions/{id}', [PromotionController::class, 'update']);
    Route::delete('/promotions/{id}', [PromotionController::class, 'destroy']);
    Route::get('/tipos-promocion', [PromotionController::class, 'getTiposPromocion']);

    // Verificación de apuestas
    Route::get('/bets/pending', [BetVerificationController::class, 'getPendingBets']);
    Route::get('/bets/verified', [BetVerificationController::class, 'getVerifiedBets']);
    Route::post('/bets/{id}/verify', [BetVerificationController::class, 'verifyBet']);

    // Estadísticas
    Route::get('/stats', [StatsController::class, 'index']);
    Route::get('/stats/users', [StatsController::class, 'userStats']);
    Route::get('/stats/bets', [StatsController::class, 'betStats']);
    Route::get('/stats/prizes', [StatsController::class, 'prizeStats']);

    // Gestión de limitaciones de usuarios
    Route::get('/user-limitations', 'App\Http\Controllers\Admin\UserLimitationsController@getAllUsersLimitations');
    Route::get('/user-limitations/{username}', 'App\Http\Controllers\Admin\UserLimitationsController@getUserLimitations');
    Route::put('/user-limitations/{username}', 'App\Http\Controllers\Admin\UserLimitationsController@updateUserLimitations');
    Route::post('/user-limitations/{username}/reset', 'App\Http\Controllers\Admin\UserLimitationsController@resetUserLimitations');
    Route::put('/user-limitations/{username}/toggle', 'App\Http\Controllers\Admin\UserLimitationsController@toggleUserLimitations');
    Route::get('/user-limitations/defaults', 'App\Http\Controllers\Admin\UserLimitationsController@getDefaultLimitations');
    Route::post('/user-limitations/global', 'App\Http\Controllers\Admin\UserLimitationsController@setGlobalLimitations');
});

// Añade esta ruta junto a tus otras rutas de API
Route::get('/check-translations', [PremiosController::class, 'checkTranslations']);
// Contact form route
// Update the contact route to use the same endpoint
Route::post('/contact', [App\Http\Controllers\ContactController::class, 'sendContactForm']);

// Rutas para el chat en vivo (requieren autenticación)
// Add these routes if they don't exist
Route::middleware('auth:sanctum')->group(function () {
    // Chat routes
    Route::post('/chat/start', [ChatController::class, 'startSession']);
    Route::post('/chat/messages', [ChatController::class, 'sendMessage']);
    Route::get('/chat/messages/{sessionId}', [ChatController::class, 'getMessages']);
    Route::get('/chat/read/{sessionId}', [ChatController::class, 'markAsRead']);
    Route::get('/chat/sessions', [ChatController::class, 'getActiveSessions']);
    // Rutas para administración de chat
    Route::delete('/chat/sessions/{sessionId}', [ChatController::class, 'deleteSession'])->middleware('auth:sanctum');
    Route::delete('/chat/sessions/old/{days?}', [ChatController::class, 'deleteOldSessions'])->middleware('auth:sanctum');
});
// Find this section in your api.php file (around line 206)
Route::middleware('auth:sanctum')->group(function () {
    // Existing routes...
    Route::get('/user/limitations', 'App\Http\Controllers\UserLimitationsController@getCurrentUserLimitations');
    Route::post('/user/update-time-spent', 'App\Http\Controllers\UserLimitationsController@updateTimeSpent');
});
