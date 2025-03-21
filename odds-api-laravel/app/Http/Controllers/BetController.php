<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class BetController extends Controller
{
    public function getUserActiveBets()
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Usuario no autenticado'], 401);
            }

            // Verificar si existe la columna created_at
            $hasCreatedAt = Schema::hasColumn('prediccio_proposada', 'created_at');

            // Construir la consulta base
            $query = DB::table('prediccio_proposada as pp')
                ->leftJoin('prediccions_sist as ps', 'pp.id', '=', 'ps.prediccio_proposada_id')
                ->where(function($q) use ($user) {
                    $q->where('pp.usuari_nick', $user->nick)
                      ->where(function($q2) {
                          $q2->whereNull('ps.id')
                             ->orWhere('ps.validat', 0);
                      });
                });

            // Seleccionar campos
            $query->select('pp.*');

            // Agregar ordenamiento solo si existe la columna
            if ($hasCreatedAt) {
                $query->orderBy('pp.created_at', 'desc');
            }

            $activeBets = $query->get();

            return response()->json($activeBets);
        } catch (\Exception $e) {
            Log::error('Error in BetController::getUserActiveBets: ' . $e->getMessage(), [
                'user' => Auth::user() ? Auth::user()->nick : 'unknown'
            ]);
            return response()->json(['message' => 'Error al obtener apuestas activas: ' . $e->getMessage()], 500);
        }
    }

    public function getUserBetHistory()
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Usuario no autenticado'], 401);
            }

            // Verificar si existe la columna created_at y resultat_prediccio
            $hasCreatedAt = Schema::hasColumn('prediccio_proposada', 'created_at');

            // Obtener la estructura de resultat_prediccio
            $resultatColumns = DB::select("SHOW COLUMNS FROM resultat_prediccio");
            $statusColumn = 'resultat_prediccio'; // Columna por defecto

            // Buscar la columna correcta para el estado
            foreach ($resultatColumns as $column) {
                if ($column->Field === 'resultat_prediccio') {
                    $statusColumn = 'resultat_prediccio';
                    break;
                } else if ($column->Field === 'validacio') {
                    $statusColumn = 'validacio';
                    break;
                }
            }

            // Get completed bets (validated)
            $query = DB::table('prediccio_proposada as pp')
                ->join('prediccions_sist as ps', 'pp.id', '=', 'ps.prediccio_proposada_id')
                ->join('resultat_prediccio as rp', 'ps.resultat_prediccio_id', '=', 'rp.id')
                ->where('pp.usuari_nick', $user->nick)
                ->where('ps.validat', true);

            // Seleccionar campos
            $query->select(
                'pp.*',
                "rp.{$statusColumn} as status"
            );

            // Agregar ordenamiento solo si existe la columna
            if ($hasCreatedAt) {
                $query->orderBy('pp.created_at', 'desc');
            }

            $betHistory = $query->get();

            // Mapear los estados para que sean consistentes en la interfaz
            $betHistory = $betHistory->map(function($bet) {
                if (isset($bet->status)) {
                    if (strtolower($bet->status) === 'guanyat') {
                        $bet->status = 'Ganada';
                    } else if (strtolower($bet->status) === 'perdut') {
                        $bet->status = 'Perdida';
                    } else if (strtolower($bet->status) === 'empat') {
                        $bet->status = 'Empate';
                    }
                }
                return $bet;
            });

            return response()->json($betHistory);
        } catch (\Exception $e) {
            Log::error('Error in BetController::getUserBetHistory: ' . $e->getMessage(), [
                'user' => Auth::user() ? Auth::user()->nick : 'unknown'
            ]);
            return response()->json(['message' => 'Error al obtener historial de apuestas: ' . $e->getMessage()], 500);
        }
    }

    public function getUserBetStats()
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Usuario no autenticado'], 401);
            }

            // Obtener la estructura de resultat_prediccio
            $resultatColumns = DB::select("SHOW COLUMNS FROM resultat_prediccio");
            $statusColumn = 'resultat_prediccio'; // Columna por defecto

            // Buscar la columna correcta para el estado
            foreach ($resultatColumns as $column) {
                if ($column->Field === 'resultat_prediccio') {
                    $statusColumn = 'resultat_prediccio';
                    break;
                } else if ($column->Field === 'validacio') {
                    $statusColumn = 'validacio';
                    break;
                }
            }

            // Total de apuestas
            $totalBets = DB::table('prediccio_proposada')
                ->where('usuari_nick', $user->nick)
                ->count();

            // Apuestas ganadas
            $wonBetsQuery = DB::table('prediccio_proposada as pp')
                ->join('prediccions_sist as ps', 'pp.id', '=', 'ps.prediccio_proposada_id')
                ->join('resultat_prediccio as rp', 'ps.resultat_prediccio_id', '=', 'rp.id')
                ->where('pp.usuari_nick', $user->nick)
                ->where('ps.validat', 1);

            // Usar la columna correcta para el filtro
            if ($statusColumn === 'resultat_prediccio') {
                $wonBetsQuery->where('rp.resultat_prediccio', 'Guanyat');
            } else {
                $wonBetsQuery->where('rp.validacio', 'Guanyat');
            }

            $wonBets = $wonBetsQuery->count();

            // Apuestas perdidas
            $lostBetsQuery = DB::table('prediccio_proposada as pp')
                ->join('prediccions_sist as ps', 'pp.id', '=', 'ps.prediccio_proposada_id')
                ->join('resultat_prediccio as rp', 'ps.resultat_prediccio_id', '=', 'rp.id')
                ->where('pp.usuari_nick', $user->nick)
                ->where('ps.validat', 1);

            // Usar la columna correcta para el filtro
            if ($statusColumn === 'resultat_prediccio') {
                $lostBetsQuery->where('rp.resultat_prediccio', 'Perdut');
            } else {
                $lostBetsQuery->where('rp.validacio', 'Perdut');
            }

            $lostBets = $lostBetsQuery->count();

            // Apuestas pendientes
            $pendingBets = DB::table('prediccio_proposada as pp')
                ->leftJoin('prediccions_sist as ps', 'pp.id', '=', 'ps.prediccio_proposada_id')
                ->where('pp.usuari_nick', $user->nick)
                ->where(function($query) {
                    $query->whereNull('ps.id')
                          ->orWhere('ps.validat', 0);
                })
                ->count();

            // Ganancias totales
            $totalWinnings = DB::table('prediccio_proposada as pp')
                ->join('prediccions_sist as ps', 'pp.id', '=', 'ps.prediccio_proposada_id')
                ->join('resultat_prediccio as rp', 'ps.resultat_prediccio_id', '=', 'rp.id')
                ->where('pp.usuari_nick', $user->nick)
                ->where('ps.validat', 1);

            // Usar la columna correcta para el filtro
            if ($statusColumn === 'resultat_prediccio') {
                $totalWinnings->where('rp.resultat_prediccio', 'Guanyat');
            } else {
                $totalWinnings->where('rp.validacio', 'Guanyat');
            }

            $totalWinnings = $totalWinnings->sum(DB::raw('pp.punts_proposats * pp.cuota'));

            // Calcular porcentaje de victoria
            $completedBets = $wonBets + $lostBets;
            $winRate = $completedBets > 0 ? ($wonBets / $completedBets) * 100 : 0;

            $stats = [
                'totalBets' => $totalBets,
                'wonBets' => $wonBets,
                'lostBets' => $lostBets,
                'pendingBets' => $pendingBets,
                'totalWinnings' => $totalWinnings,
                'winRate' => $winRate
            ];

            return response()->json($stats);
        } catch (\Exception $e) {
            Log::error('Error in BetController::getUserBetStats: ' . $e->getMessage(), [
                'user' => Auth::user() ? Auth::user()->nick : 'unknown'
            ]);
            return response()->json(['message' => 'Error al obtener estadísticas de apuestas: ' . $e->getMessage()], 500);
        }
    }
}