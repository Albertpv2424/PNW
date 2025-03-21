<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BetController extends Controller
{
    /**
     * Get active bets for the current user
     */
    public function getUserActiveBets()
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Usuario no autenticado'], 401);
            }

            // Get active (pending) bets
            $activeBets = DB::table('prediccio_proposada as pp')
                ->leftJoin('prediccions_sist as ps', 'pp.id', '=', 'ps.prediccio_proposada_id')
                ->where('pp.usuari_nick', $user->nick)
                ->whereNull('ps.id') // No system prediction yet (pending)
                ->orWhere(function($query) use ($user) {
                    $query->where('pp.usuari_nick', $user->nick)
                          ->where('ps.validat', false); // Not validated yet
                })
                ->select('pp.*')
                ->orderBy('pp.created_at', 'desc')
                ->get();

            return response()->json($activeBets);
        } catch (\Exception $e) {
            Log::error('Error in BetController::getUserActiveBets: ' . $e->getMessage(), [
                'user' => Auth::user() ? Auth::user()->nick : 'unauthenticated',
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json(['message' => 'Error al obtener las apuestas activas'], 500);
        }
    }

    /**
     * Get bet history for the current user
     */
    public function getUserBetHistory()
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Usuario no autenticado'], 401);
            }

            // Get completed bets (validated)
            $betHistory = DB::table('prediccio_proposada as pp')
                ->join('prediccions_sist as ps', 'pp.id', '=', 'ps.prediccio_proposada_id')
                ->join('resultat_prediccio as rp', 'ps.resultat_prediccio_id', '=', 'rp.id')
                ->where('pp.usuari_nick', $user->nick)
                ->where('ps.validat', true)
                ->select(
                    'pp.*',
                    'rp.nom as status'
                )
                ->orderBy('pp.created_at', 'desc')
                ->get();

            return response()->json($betHistory);
        } catch (\Exception $e) {
            Log::error('Error in BetController::getUserBetHistory: ' . $e->getMessage(), [
                'user' => Auth::user() ? Auth::user()->nick : 'unauthenticated',
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json(['message' => 'Error al obtener el historial de apuestas'], 500);
        }
    }

    /**
     * Get bet statistics for the current user
     */
    public function getUserBetStats()
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Usuario no autenticado'], 401);
            }

            // Get total bets
            $totalBets = DB::table('prediccio_proposada')
                ->where('usuari_nick', $user->nick)
                ->count();

            // Get won bets
            $wonBets = DB::table('prediccio_proposada as pp')
                ->join('prediccions_sist as ps', 'pp.id', '=', 'ps.prediccio_proposada_id')
                ->join('resultat_prediccio as rp', 'ps.resultat_prediccio_id', '=', 'rp.id')
                ->where('pp.usuari_nick', $user->nick)
                ->where('ps.validat', true)
                ->where('rp.nom', 'ganada')
                ->count();

            // Get lost bets
            $lostBets = DB::table('prediccio_proposada as pp')
                ->join('prediccions_sist as ps', 'pp.id', '=', 'ps.prediccio_proposada_id')
                ->join('resultat_prediccio as rp', 'ps.resultat_prediccio_id', '=', 'rp.id')
                ->where('pp.usuari_nick', $user->nick)
                ->where('ps.validat', true)
                ->where('rp.nom', 'perdida')
                ->count();

            // Get pending bets
            $pendingBets = DB::table('prediccio_proposada as pp')
                ->leftJoin('prediccions_sist as ps', 'pp.id', '=', 'ps.prediccio_proposada_id')
                ->where('pp.usuari_nick', $user->nick)
                ->where(function($query) {
                    $query->whereNull('ps.id')
                          ->orWhere('ps.validat', false);
                })
                ->count();

            // Calculate total winnings
            $totalWinnings = DB::table('prediccio_proposada as pp')
                ->join('prediccions_sist as ps', 'pp.id', '=', 'ps.prediccio_proposada_id')
                ->join('resultat_prediccio as rp', 'ps.resultat_prediccio_id', '=', 'rp.id')
                ->where('pp.usuari_nick', $user->nick)
                ->where('ps.validat', true)
                ->where('rp.nom', 'ganada')
                ->sum(DB::raw('pp.punts_proposats * pp.cuota'));

            // Calculate win rate
            $winRate = 0;
            $completedBets = $wonBets + $lostBets;
            if ($completedBets > 0) {
                $winRate = ($wonBets / $completedBets) * 100;
            }

            return response()->json([
                'total_bets' => $totalBets,
                'won_bets' => $wonBets,
                'lost_bets' => $lostBets,
                'pending_bets' => $pendingBets,
                'total_winnings' => $totalWinnings,
                'win_rate' => $winRate
            ]);
        } catch (\Exception $e) {
            Log::error('Error in BetController::getUserBetStats: ' . $e->getMessage(), [
                'user' => Auth::user() ? Auth::user()->nick : 'unauthenticated',
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json(['message' => 'Error al obtener las estadísticas de apuestas'], 500);
        }
    }
}