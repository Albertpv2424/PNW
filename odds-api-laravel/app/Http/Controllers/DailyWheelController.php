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
    public function checkStatus()
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Usuario no autenticado'], 401);
            }

            // Añade logs para depuración
            Log::info('DailyWheel checkStatus for user: ' . $user->nick);

            // Make sure we're using the correct column name
            $tracking = DailyRewardsTracking::where('usuari_nick', $user->nick)
                ->where('date', now()->format('Y-m-d'))
                ->first();

            Log::info('DailyWheel tracking record found: ' . ($tracking ? 'yes' : 'no'));

            if (!$tracking) {
                return response()->json([
                    'canSpin' => true,
                    'pointsEarned' => 0
                ]);
            }

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
                'error' => 'Error checking status: ' . $e->getMessage()
            ], 500); // Cambiado a 500 para ser más explícito
        }
    }

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

            // Get or create today's tracking record using the correct column name
            $tracking = DailyRewardsTracking::where('usuari_nick', $user->nick)
                ->where('date', now()->format('Y-m-d'))
                ->first();

            if (!$tracking) {
                $tracking = new DailyRewardsTracking();
                $tracking->usuari_nick = $user->nick;
                $tracking->date = now()->format('Y-m-d');
                $tracking->wheel_spun = false;
                $tracking->wheel_points_earned = 0;
                $tracking->videos_watched = 0;
                $tracking->video_points_earned = 0;
            }

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

            return response()->json(['message' => 'Error al procesar la solicitud: ' . $e->getMessage()], 500);
        }
    }
}