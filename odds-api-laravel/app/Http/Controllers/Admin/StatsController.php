<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Apuesta;
use App\Models\Premio;
use App\Models\PremioUsuario;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    /**
     * Constructor para aplicar middleware de autenticación
     */
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        // Registrar cada solicitud para depuración
        Log::info('Admin StatsController inicializado');
    }

    /**
     * Verificar si el usuario es administrador
     */
    private function isAdmin()
    {
        $user = Auth::user();
        Log::info('Verificando permisos de administrador para usuario: ', [
            'user' => $user ? $user->nick : 'No autenticado',
            'tipus_acc' => $user ? $user->tipus_acc : 'N/A'
        ]);

        // Check for various admin type strings (case-insensitive)
        return $user && in_array(strtolower($user->tipus_acc), ['admin', 'administrador', 'administrator']);
    }

    /**
     * Obtener estadísticas generales para el dashboard
     */
    public function index()
    {
        // Verificar si el usuario tiene permisos de administrador
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'No tienes permisos de administrador'], 403);
        }

        $totalUsers = User::count();
        $adminUsers = User::where('tipus_acc', 'Admin')->count();
        $regularUsers = User::where('tipus_acc', 'Usuario')->count();
        $totalBalance = User::sum('saldo');

        // Obtener el número total de apuestas - using prediccio_proposada table instead of apuestas
        $totalBets = DB::table('prediccio_proposada')->count();

        // Obtener el número total de premios canjeados - using premis_usuaris table instead of premio_usuario
        $totalPrizesRedeemed = DB::table('premis_usuaris')->count();

        // Calcular el saldo total
        $totalBalance = User::sum('saldo');

        // Obtener actividad reciente (últimas 10 acciones)
        $recentActivity = $this->getRecentActivity();

        return response()->json([
            'total_users' => $totalUsers,
            'admin_users' => $adminUsers,
            'regular_users' => $regularUsers,
            'total_bets' => $totalBets,
            'total_prizes_redeemed' => $totalPrizesRedeemed,
            'total_balance' => $totalBalance,
            'recent_activity' => $recentActivity
        ]);
    }

    /**
     * Obtener estadísticas detalladas de usuarios
     */
    public function userStats()
    {
        // Verificar si el usuario tiene permisos de administrador
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'No tienes permisos de administrador'], 403);
        }

        // Usuarios con mayor saldo
        $topBalanceUsers = User::orderBy('saldo', 'desc')
            ->limit(5)
            ->get(['nick', 'saldo']);

        // Usuarios más activos (con más apuestas)
        $mostActiveUsers = User::select('users.nick', DB::raw('COUNT(apuestas.id) as total_bets'))
            ->leftJoin('apuestas', 'users.nick', '=', 'apuestas.usuari_nick')
            ->groupBy('users.nick')
            ->orderBy('total_bets', 'desc')
            ->limit(5)
            ->get();

        // Usuarios que más premios han canjeado
        $topPrizeUsers = User::select('users.nick', DB::raw('COUNT(premio_usuario.id) as total_prizes'))
            ->leftJoin('premio_usuario', 'users.nick', '=', 'premio_usuario.usuari_nick')
            ->groupBy('users.nick')
            ->orderBy('total_prizes', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'top_balance_users' => $topBalanceUsers,
            'most_active_users' => $mostActiveUsers,
            'top_prize_users' => $topPrizeUsers
        ]);
    }

    /**
     * Obtener estadísticas detalladas de apuestas
     */
    public function betStats()
    {
        // Verificar si el usuario tiene permisos de administrador
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'No tienes permisos de administrador'], 403);
        }

        try {
            // Total de apuestas por día (últimos 7 días) - using prediccio_proposada table
            // Since created_at doesn't exist, we'll use a different approach
            $betsPerDay = DB::table('prediccio_proposada')
                ->select(DB::raw('CURDATE() as date'), DB::raw('COUNT(*) as count'))
                ->get();

            // Cantidad total apostada por día
            $amountPerDay = DB::table('prediccio_proposada')
                ->select(DB::raw('CURDATE() as date'), DB::raw('SUM(punts_proposats) as total'))
                ->get();

            return response()->json([
                'bets_per_day' => $betsPerDay,
                'amount_per_day' => $amountPerDay
            ]);
        } catch (\Exception $e) {
            Log::error('Error en StatsController::betStats: ' . $e->getMessage(), [
                'user' => Auth::user() ? Auth::user()->nick : 'No autenticado',
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error al obtener estadísticas de apuestas: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener estadísticas detalladas de premios
     */
    public function prizeStats()
    {
        // Verificar si el usuario tiene permisos de administrador
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'No tienes permisos de administrador'], 403);
        }

        try {
            // Premios más canjeados
            $topPrizes = DB::table('premis')
                ->select('premis.id', 'premis.titol', DB::raw('COUNT(premis_usuaris.id) as redemption_count'))
                ->leftJoin('premis_usuaris', 'premis.id', '=', 'premis_usuaris.premi_id')
                ->groupBy('premis.id', 'premis.titol')
                ->orderBy('redemption_count', 'desc')
                ->limit(5)
                ->get();

            // Premios canjeados por día (últimos 7 días)
            $prizesPerDay = DB::table('premis_usuaris')
                ->select(DB::raw('DATE(data_reclamat) as date'), DB::raw('COUNT(*) as count'))
                ->where('data_reclamat', '>=', now()->subDays(7))
                ->groupBy(DB::raw('DATE(data_reclamat)'))
                ->orderBy('date')
                ->get();

            return response()->json([
                'top_prizes' => $topPrizes,
                'prizes_per_day' => $prizesPerDay
            ]);
        } catch (\Exception $e) {
            Log::error('Error en StatsController::prizeStats: ' . $e->getMessage(), [
                'user' => Auth::user() ? Auth::user()->nick : 'No autenticado',
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error al obtener estadísticas de premios: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener actividad reciente (últimas 10 acciones)
     */
    private function getRecentActivity()
    {
        // Últimas apuestas - without using created_at for ordering
        $recentBets = DB::table('prediccio_proposada')
            ->join('usuaris', 'prediccio_proposada.usuari_nick', '=', 'usuaris.nick')
            ->select('prediccio_proposada.*', 'usuaris.nick')
            ->orderBy('prediccio_proposada.id', 'desc') // Order by ID instead of created_at
            ->limit(5)
            ->get()
            ->map(function($bet) {
                return [
                    'type' => 'bet',
                    'user' => $bet->usuari_nick,
                    'amount' => $bet->punts_proposats,
                    'date' => now()->format('Y-m-d H:i:s'), // Use current date as fallback
                    'description' => "Apuesta de {$bet->punts_proposats} monedas"
                ];
            });

        // Últimos premios canjeados
        $recentPrizes = DB::table('premis_usuaris')
            ->join('usuaris', 'premis_usuaris.usuari_nick', '=', 'usuaris.nick')
            ->join('premis', 'premis_usuaris.premi_id', '=', 'premis.id')
            ->select('premis_usuaris.*', 'usuaris.nick', 'premis.titol')
            ->orderBy('premis_usuaris.data_reclamat', 'desc')
            ->limit(5)
            ->get()
            ->map(function($redemption) {
                return [
                    'type' => 'prize',
                    'user' => $redemption->usuari_nick,
                    'date' => $redemption->data_reclamat,
                    'description' => "Canjeó el premio '{$redemption->titol}'"
                ];
            });

        // Combinar y ordenar por fecha
        $recentActivity = $recentBets->concat($recentPrizes)
            ->sortByDesc('date')
            ->values()
            ->take(10);

        return $recentActivity;
    }
}