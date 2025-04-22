<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\DailyRewardsTracking;
use Carbon\Carbon;

class UserLimitationsController extends Controller
{
    /**
     * Constructor para aplicar middleware de autenticación
     */
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware(function ($request, $next) {
            if (!in_array(strtolower(Auth::user()->tipus_acc), ['admin', 'administrador', 'administrator'])) {
                return response()->json(['message' => 'No tienes permisos para acceder a esta sección'], 403);
            }
            
            return $next($request);
        });
    }

    /**
     * Obtener las limitaciones actuales de un usuario
     */
    public function getUserLimitations($username)
    {
        try {
            $user = User::where('nick', $username)->first();
            
            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }
            
            $today = Carbon::today();
            
            $limitations = DailyRewardsTracking::where('usuari_nick', $username)
                ->where('date', $today)
                ->first();
                
            if (!$limitations) {
                // Si no existe un registro para hoy, crear uno con valores predeterminados
                $limitations = new DailyRewardsTracking();
                $limitations->usuari_nick = $username;
                $limitations->date = $today;
                $limitations->bets_today = 0;
                $limitations->max_daily_bets = 5; // Valor predeterminado
                $limitations->betting_time_today = 0;
                $limitations->max_daily_betting_time = 3600; // 1 hora en segundos
                $limitations->save();
            }
            
            return response()->json([
                'username' => $username,
                'bets_today' => $limitations->bets_today,
                'max_daily_bets' => $limitations->max_daily_bets,
                'betting_time_today' => $limitations->betting_time_today,
                'max_daily_betting_time' => $limitations->max_daily_betting_time,
                'remaining_bets' => max(0, $limitations->max_daily_bets - $limitations->bets_today),
                'remaining_time' => max(0, $limitations->max_daily_betting_time - $limitations->betting_time_today)
            ]);
        } catch (\Exception $e) {
            Log::error('Error en UserLimitationsController::getUserLimitations: ' . $e->getMessage(), [
                'user' => Auth::user() ? Auth::user()->nick : 'No autenticado',
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Error al obtener limitaciones: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Actualizar las limitaciones de un usuario
     */
    public function updateUserLimitations(Request $request, $username)
    {
        try {
            $request->validate([
                'max_daily_bets' => 'required|integer|min:1',
                'max_daily_betting_time' => 'required|integer|min:60' // Mínimo 1 minuto
            ]);
            
            $user = User::where('nick', $username)->first();
            
            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }
            
            $today = Carbon::today();
            
            $limitations = DailyRewardsTracking::where('usuari_nick', $username)
                ->where('date', $today)
                ->first();
                
            if (!$limitations) {
                $limitations = new DailyRewardsTracking();
                $limitations->usuari_nick = $username;
                $limitations->date = $today;
                $limitations->bets_today = 0;
                $limitations->betting_time_today = 0;
            }
            
            $limitations->max_daily_bets = $request->max_daily_bets;
            $limitations->max_daily_betting_time = $request->max_daily_betting_time;
            $limitations->save();
            
            return response()->json([
                'message' => 'Limitaciones actualizadas correctamente',
                'username' => $username,
                'max_daily_bets' => $limitations->max_daily_bets,
                'max_daily_betting_time' => $limitations->max_daily_betting_time
            ]);
        } catch (\Exception $e) {
            Log::error('Error en UserLimitationsController::updateUserLimitations: ' . $e->getMessage(), [
                'user' => Auth::user() ? Auth::user()->nick : 'No autenticado',
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Error al actualizar limitaciones: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Obtener un resumen de las limitaciones de todos los usuarios
     */
    public function getAllUsersLimitations()
    {
        try {
            $today = Carbon::today();
            
            // Obtener todos los usuarios que no son administradores
            $users = User::where(function($query) {
                $query->whereRaw('LOWER(tipus_acc) != ?', ['admin'])
                      ->whereRaw('LOWER(tipus_acc) != ?', ['administrador'])
                      ->whereRaw('LOWER(tipus_acc) != ?', ['administrator']);
            })->get();
            
            $result = [];
            
            foreach ($users as $user) {
                // Obtener las limitaciones del usuario
                $limitations = DailyRewardsTracking::where('usuari_nick', $user->nick)
                    ->where('date', $today)
                    ->first();
                
                // Si no tiene limitaciones configuradas, crear un objeto con valores predeterminados
                if (!$limitations) {
                    $limitations = [
                        'bets_today' => 0,
                        'max_daily_bets' => 5, // Valor predeterminado
                        'betting_time_today' => 0,
                        'max_daily_betting_time' => 3600, // 1 hora en segundos
                        'date' => $today->format('Y-m-d')
                    ];
                }
                
                // Añadir información del usuario y sus limitaciones
                $result[] = [
                    'username' => $user->nick,
                    'email' => $user->email,
                    'saldo' => $user->saldo,
                    'bets_today' => $limitations instanceof DailyRewardsTracking ? $limitations->bets_today : $limitations['bets_today'],
                    'max_daily_bets' => $limitations instanceof DailyRewardsTracking ? $limitations->max_daily_bets : $limitations['max_daily_bets'],
                    'betting_time_today' => $limitations instanceof DailyRewardsTracking ? $limitations->betting_time_today : $limitations['betting_time_today'],
                    'max_daily_betting_time' => $limitations instanceof DailyRewardsTracking ? $limitations->max_daily_betting_time : $limitations['max_daily_betting_time'],
                    'date' => $limitations instanceof DailyRewardsTracking ? $limitations->date : $limitations['date'],
                    'is_limited' => $limitations instanceof DailyRewardsTracking ? 
                        ($limitations->max_daily_bets < 999999) : 
                        ($limitations['max_daily_bets'] < 999999)
                ];
            }
            
            return response()->json($result);
        } catch (\Exception $e) {
            Log::error('Error en UserLimitationsController::getAllUsersLimitations: ' . $e->getMessage(), [
                'user' => Auth::user() ? Auth::user()->nick : 'No autenticado',
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Error al obtener limitaciones de usuarios: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Habilitar o deshabilitar las limitaciones para un usuario específico
     */
    public function toggleUserLimitations(Request $request, $username)
    {
        try {
            $request->validate([
                'enabled' => 'required|boolean'
            ]);
            
            $user = User::where('nick', $username)->first();
            
            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }
            
            $today = Carbon::today();
            
            $limitations = DailyRewardsTracking::where('usuari_nick', $username)
                ->where('date', $today)
                ->first();
                
            if (!$limitations) {
                $limitations = new DailyRewardsTracking();
                $limitations->usuari_nick = $username;
                $limitations->date = $today;
                $limitations->bets_today = 0;
                $limitations->betting_time_today = 0;
                $limitations->max_daily_bets = 5; // Valor predeterminado
                $limitations->max_daily_betting_time = 3600; // 1 hora en segundos
            }
            
            // Si está deshabilitado, establecer límites muy altos
            if (!$request->enabled) {
                $limitations->max_daily_bets = 999999;
                $limitations->max_daily_betting_time = 86400 * 7; // 7 días en segundos
            } else {
                // Si se está habilitando, establecer valores predeterminados
                $limitations->max_daily_bets = 5;
                $limitations->max_daily_betting_time = 3600;
            }
            
            $limitations->save();
            
            return response()->json([
                'message' => $request->enabled ? 'Limitaciones habilitadas para el usuario' : 'Limitaciones deshabilitadas para el usuario',
                'username' => $username,
                'limitations_enabled' => $request->enabled,
                'max_daily_bets' => $limitations->max_daily_bets,
                'max_daily_betting_time' => $limitations->max_daily_betting_time
            ]);
        } catch (\Exception $e) {
            Log::error('Error en UserLimitationsController::toggleUserLimitations: ' . $e->getMessage(), [
                'user' => Auth::user() ? Auth::user()->nick : 'No autenticado',
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Error al cambiar estado de limitaciones: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reiniciar los contadores de limitaciones de un usuario
     */
    public function resetUserLimitations($username)
    {
        try {
            $user = User::where('nick', $username)->first();
            
            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }
            
            $today = Carbon::today();
            
            $limitations = DailyRewardsTracking::where('usuari_nick', $username)
                ->where('date', $today)
                ->first();
                
            if (!$limitations) {
                return response()->json(['message' => 'No hay limitaciones configuradas para hoy'], 404);
            }
            
            // Reiniciar contadores manteniendo los límites
            $limitations->bets_today = 0;
            $limitations->betting_time_today = 0;
            $limitations->save();
            
            return response()->json([
                'message' => 'Contadores reiniciados correctamente',
                'username' => $username,
                'bets_today' => 0,
                'betting_time_today' => 0,
                'max_daily_bets' => $limitations->max_daily_bets,
                'max_daily_betting_time' => $limitations->max_daily_betting_time
            ]);
        } catch (\Exception $e) {
            Log::error('Error en UserLimitationsController::resetUserLimitations: ' . $e->getMessage(), [
                'user' => Auth::user() ? Auth::user()->nick : 'No autenticado',
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Error al reiniciar contadores: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener las configuraciones de limitaciones predeterminadas
     */
    public function getDefaultLimitations()
    {
        try {
            // Obtener las limitaciones más comunes como predeterminadas
            $defaultLimitations = DB::table('daily_rewards_tracking')
                ->select(
                    'max_daily_bets',
                    'max_daily_betting_time',
                    DB::raw('COUNT(*) as count')
                )
                ->where('date', Carbon::today())
                ->groupBy('max_daily_bets', 'max_daily_betting_time')
                ->orderBy('count', 'desc')
                ->first();
                
            if (!$defaultLimitations) {
                // Si no hay datos, devolver valores predeterminados
                return response()->json([
                    'max_daily_bets' => 5,
                    'max_daily_betting_time' => 3600 // 1 hora en segundos
                ]);
            }
            
            return response()->json([
                'max_daily_bets' => $defaultLimitations->max_daily_bets,
                'max_daily_betting_time' => $defaultLimitations->max_daily_betting_time
            ]);
        } catch (\Exception $e) {
            Log::error('Error en UserLimitationsController::getDefaultLimitations: ' . $e->getMessage(), [
                'user' => Auth::user() ? Auth::user()->nick : 'No autenticado',
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Error al obtener limitaciones predeterminadas: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Establecer limitaciones globales para todos los usuarios
     */
    public function setGlobalLimitations(Request $request)
    {
        try {
            $request->validate([
                'max_daily_bets' => 'required|integer|min:1',
                'max_daily_betting_time' => 'required|integer|min:60' // Mínimo 1 minuto
            ]);
            
            $today = Carbon::today();
            
            // Obtener todos los usuarios que no son administradores
            $users = User::where(function($query) {
                $query->whereRaw('LOWER(tipus_acc) != ?', ['admin'])
                      ->whereRaw('LOWER(tipus_acc) != ?', ['administrador'])
                      ->whereRaw('LOWER(tipus_acc) != ?', ['administrator']);
            })->get();
                
            $updatedCount = 0;
            
            foreach ($users as $user) {
                $limitations = DailyRewardsTracking::firstOrCreate(
                    ['usuari_nick' => $user->nick, 'date' => $today],
                    [
                        'bets_today' => 0,
                        'betting_time_today' => 0
                    ]
                );
                
                // Solo actualizar si las limitaciones están habilitadas (no son valores muy altos)
                if ($limitations->max_daily_bets < 999999) {
                    $limitations->max_daily_bets = $request->max_daily_bets;
                    $limitations->max_daily_betting_time = $request->max_daily_betting_time;
                    $limitations->save();
                    
                    $updatedCount++;
                }
            }
            
            return response()->json([
                'message' => 'Limitaciones globales actualizadas correctamente',
                'updated_users' => $updatedCount,
                'max_daily_bets' => $request->max_daily_bets,
                'max_daily_betting_time' => $request->max_daily_betting_time
            ]);
        } catch (\Exception $e) {
            Log::error('Error en UserLimitationsController::setGlobalLimitations: ' . $e->getMessage(), [
                'user' => Auth::user() ? Auth::user()->nick : 'No autenticado',
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Error al establecer limitaciones globales: ' . $e->getMessage()
            ], 500);
        }
    }
}