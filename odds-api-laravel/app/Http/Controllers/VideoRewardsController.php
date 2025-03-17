<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\DailyRewardsTracking;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class VideoRewardsController extends Controller
{
    public function addPoints(Request $request)
    {
        try {
            // Validate the request
            $request->validate([
                'points' => 'required|integer|min:10|max:50',
            ]);
            
            // Get the authenticated user
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['message' => 'Usuario no autenticado'], 401);
            }
            
            // Get or create today's tracking record
            $tracking = DailyRewardsTracking::getTodayRecord($user->nick);
            
            // Check if the user has reached the daily limit
            if ($tracking->videos_watched >= 5) {
                return response()->json([
                    'message' => 'Has alcanzado el límite diario de videos',
                    'success' => false
                ], 400);
            }
            
            // Update the user's balance with DB query to avoid model issues
            $oldSaldo = $user->saldo;
            $newSaldo = $oldSaldo + $request->points;
            
            $updated = DB::table('usuaris')
                ->where('nick', $user->nick)
                ->update(['saldo' => $newSaldo]);
                
            if (!$updated) {
                Log::error('Failed to update user saldo in database', [
                    'user_nick' => $user->nick,
                    'old_saldo' => $oldSaldo,
                    'new_saldo' => $newSaldo
                ]);
                
                return response()->json([
                    'message' => 'Error al actualizar el saldo',
                    'success' => false
                ], 500);
            }
            
            // Update the tracking record
            $tracking->videos_watched += 1;
            $tracking->video_points_earned += $request->points;
            $tracking->save();
            
            // Refresh user from database to get updated saldo
            $user = User::where('nick', $user->nick)->first();
            
            return response()->json([
                'message' => '¡Has ganado ' . $request->points . ' puntos!',
                'success' => true,
                'saldo' => $user->saldo,
                'videosWatched' => $tracking->videos_watched,
                'videosRemaining' => 5 - $tracking->videos_watched
            ]);
        } catch (\Exception $e) {
            Log::error('Error in VideoRewardsController::addPoints: ' . $e->getMessage(), [
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
                'videosWatched' => $tracking->videos_watched,
                'videosRemaining' => 5 - $tracking->videos_watched,
                'canWatchMore' => $tracking->videos_watched < 5,
                'pointsEarned' => $tracking->video_points_earned
            ]);
        } catch (\Exception $e) {
            Log::error('Error in VideoRewardsController::checkStatus: ' . $e->getMessage(), [
                'user' => Auth::user() ? Auth::user()->nick : 'unauthenticated',
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'videosWatched' => 0,
                'videosRemaining' => 5,
                'canWatchMore' => true,
                'pointsEarned' => 0,
                'error' => 'Error checking status'
            ]);
        }
    }
}