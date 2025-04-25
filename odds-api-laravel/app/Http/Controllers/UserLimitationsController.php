<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\DailyRewardsTracking;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class UserLimitationsController extends Controller
{
    public function getCurrentUserLimitations()
    {
        try {
            $user = auth()->user();
            
            if (!$user) {
                return response()->json(['error' => 'Usuario no autenticado'], 401);
            }
            
            $today = Carbon::today();
            
            $limitations = DailyRewardsTracking::where('usuari_nick', $user->nick)
                ->where('date', $today)
                ->first();
                
            if (!$limitations) {
                // Si no existe un registro para hoy, crear uno con valores predeterminados
                $limitations = new DailyRewardsTracking();
                $limitations->usuari_nick = $user->nick;
                $limitations->date = $today;
                $limitations->bets_today = 0;
                $limitations->max_daily_bets = 5; // Valor predeterminado
                $limitations->betting_time_today = 0;
                $limitations->max_daily_betting_time = 3600; // 1 hora en segundos
                $limitations->save();
            }
            
            return response()->json([
                'bets_today' => $limitations->bets_today,
                'max_daily_bets' => $limitations->max_daily_bets,
                'betting_time_today' => $limitations->betting_time_today,
                'max_daily_betting_time' => $limitations->max_daily_betting_time,
                'remaining_bets' => $limitations->max_daily_bets - $limitations->bets_today,
                'remaining_time' => $limitations->max_daily_betting_time - $limitations->betting_time_today
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error al obtener limitaciones del usuario: ' . $e->getMessage());
            return response()->json(['error' => 'Error al obtener limitaciones'], 500);
        }
    }
    
    public function updateTimeSpent(Request $request)
    {
        try {
            $user = auth()->user();
            
            if (!$user) {
                return response()->json(['error' => 'Usuario no autenticado'], 401);
            }
            
            $request->validate([
                'time_spent' => 'required|integer|min:0'
            ]);
            
            $today = Carbon::today();
            
            $limitations = DailyRewardsTracking::where('usuari_nick', $user->nick)
                ->where('date', $today)
                ->first();
                
            if (!$limitations) {
                $limitations = new DailyRewardsTracking();
                $limitations->usuari_nick = $user->nick;
                $limitations->date = $today;
                $limitations->bets_today = 0;
                $limitations->max_daily_bets = 5; // Valor predeterminado
                $limitations->betting_time_today = 0;
                $limitations->max_daily_betting_time = 3600; // 1 hora en segundos
            }
            
            // Actualizar el tiempo gastado
            $limitations->betting_time_today = $request->time_spent;
            $limitations->save();
            
            // Calcular tiempo restante
            $remainingTime = $limitations->max_daily_betting_time - $limitations->betting_time_today;
            $remainingTime = max(0, $remainingTime);
            
            return response()->json([
                'message' => 'Tiempo actualizado correctamente',
                'betting_time_today' => $limitations->betting_time_today,
                'max_daily_betting_time' => $limitations->max_daily_betting_time,
                'remaining_time' => $remainingTime
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error al actualizar tiempo gastado: ' . $e->getMessage());
            return response()->json(['error' => 'Error al actualizar tiempo'], 500);
        }
    }
}