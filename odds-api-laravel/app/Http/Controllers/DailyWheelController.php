<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\DailyRewardsTracking;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class DailyWheelController extends Controller
{
    public function spin(Request $request)
    {
        try {
            // Validate the request
            $request->validate([
                'points' => 'required|integer|min:10|max:500',
            ]);
            
            // Get the authenticated user
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['message' => 'Usuario no autenticado'], 401);
            }
            
            // Get or create today's tracking record
            $tracking = DailyRewardsTracking::getTodayRecord($user->nick);
            
            // Check if the user has already spun the wheel today
            if ($tracking->wheel_spun) {
                return response()->json(['message' => 'Ya has girado la ruleta hoy'], 400);
            }
            
            // Update the user's balance
            $newSaldo = $user->saldo + $request->points;
            $user->saldo = $newSaldo;
            $user->save();
            
            // Update the tracking record
            $tracking->wheel_spun = true;
            $tracking->wheel_points_earned = $request->points;
            $tracking->save();
            
            return response()->json([
                'message' => '¡Felicidades! Has ganado ' . $request->points . ' puntos',
                'saldo' => $newSaldo
            ]);
        } catch (\Exception $e) {
            Log::error('Error in DailyWheelController::spin: ' . $e->getMessage(), [
                'user' => Auth::user() ? Auth::user()->nick : 'unauthenticated',
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json(['message' => 'Error al procesar la solicitud'], 500);
        }
    }
    
    public function checkStatus()
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['message' => 'Usuario no autenticado'], 401);
            }
            
            $tracking = DailyRewardsTracking::getTodayRecord($user->nick);
            
            return response()->json([
                'canSpin' => !$tracking->wheel_spun,
                'pointsEarned' => $tracking->wheel_points_earned
            ]);
        } catch (\Exception $e) {
            Log::error('Error in DailyWheelController::checkStatus: ' . $e->getMessage(), [
                'user' => Auth::user() ? Auth::user()->nick : 'unauthenticated',
                'trace' => $e->getTraceAsString()
            ]);
            
            // Return a default response in case of error
            return response()->json([
                'canSpin' => true,
                'pointsEarned' => 0,
                'error' => 'Error checking status'
            ]);
        }
    }
}