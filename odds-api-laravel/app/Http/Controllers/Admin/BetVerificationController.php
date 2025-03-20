<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BetVerificationController extends Controller
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
            
            // Enable query logging for debugging
            DB::enableQueryLog();
            
            return $next($request);
        });
    }

    /**
     * Obtener todas las apuestas pendientes de verificación
     */
    public function getPendingBets()
    {
        try {
            // Log the start of the method for debugging
            Log::info('Starting getPendingBets method');
            
            // Use a simpler query approach to get pending bets
            $pendingBets = DB::table('prediccio_proposada')
                ->join('usuaris', 'prediccio_proposada.usuari_nick', '=', 'usuaris.nick')
                ->whereNotExists(function ($query) {
                    $query->select(DB::raw(1))
                          ->from('prediccions_sist')
                          ->whereRaw('prediccions_sist.prediccio_proposada_id = prediccio_proposada.id')
                          ->whereNotNull('prediccions_sist.resultat_prediccio_id')
                          ->where('prediccions_sist.validat', true);
                })
                ->select(
                    'prediccio_proposada.id',
                    'prediccio_proposada.usuari_nick',
                    'prediccio_proposada.cuota',
                    'prediccio_proposada.punts_proposats',
                    'prediccio_proposada.match_info',
                    'prediccio_proposada.prediction_choice',
                    'prediccio_proposada.tipo_apuesta',
                    // Remove created_at as it doesn't exist
                    'usuaris.email'
                )
                ->orderBy('prediccio_proposada.id', 'desc') // Order by ID instead of created_at
                ->get();

            // Log the SQL query for debugging
            $queryLog = DB::getQueryLog();
            if (!empty($queryLog)) {
                Log::info('SQL Query: ' . $queryLog[count($queryLog)-1]['query']);
                Log::info('SQL Bindings: ', $queryLog[count($queryLog)-1]['bindings']);
            } else {
                Log::info('Query log is empty. Make sure DB::enableQueryLog() is called.');
            }
            
            Log::info('Found ' . count($pendingBets) . ' pending bets');

            // Para cada apuesta, obtener los detalles
            foreach ($pendingBets as $bet) {
                try {
                    $bet->detalles = DB::table('detalle_prediccio')
                        ->where('prediccio_proposada_id', $bet->id)
                        ->get();
                    
                    // Calcular ganancia potencial
                    $bet->ganancia_potencial = $bet->punts_proposats * $bet->cuota;
                } catch (\Exception $innerEx) {
                    Log::error('Error processing bet details for bet ID ' . $bet->id . ': ' . $innerEx->getMessage());
                    $bet->detalles = [];
                    $bet->ganancia_potencial = 0;
                }
            }

            return response()->json($pendingBets);
        } catch (\Exception $e) {
            Log::error('Error al obtener apuestas pendientes: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            Log::error('File: ' . $e->getFile() . ' Line: ' . $e->getLine());
            
            // Check if the error is related to a missing column
            if (strpos($e->getMessage(), 'Column not found') !== false || 
                strpos($e->getMessage(), 'Unknown column') !== false) {
                
                // Get table structure for debugging
                try {
                    $prediccioProposadaColumns = DB::select("SHOW COLUMNS FROM prediccio_proposada");
                    $prediccionsSistColumns = DB::select("SHOW COLUMNS FROM prediccions_sist");
                    
                    Log::info('prediccio_proposada columns:', array_map(function($col) {
                        return $col->Field;
                    }, $prediccioProposadaColumns));
                    
                    Log::info('prediccions_sist columns:', array_map(function($col) {
                        return $col->Field;
                    }, $prediccionsSistColumns));
                } catch (\Exception $schemaEx) {
                    Log::error('Error getting schema: ' . $schemaEx->getMessage());
                }
            }
            
            return response()->json(['error' => 'Error al obtener apuestas pendientes: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Verificar una apuesta (marcarla como ganada o perdida)
     */
    /**
     * Verificar una apuesta (marcarla como ganada o perdida)
     */
    public function verifyBet(Request $request, $id)
    {
        try {
            // Validar datos
            $request->validate([
                'resultado' => 'required|in:ganada,perdida',
                'comentario' => 'nullable|string'
            ]);
    
            // Iniciar transacción
            DB::beginTransaction();
    
            // Obtener la apuesta
            $bet = DB::table('prediccio_proposada')->where('id', $id)->first();
            if (!$bet) {
                return response()->json(['error' => 'Apuesta no encontrada'], 404);
            }
    
            // Verificar que no esté ya verificada
            $existingResult = DB::table('prediccions_sist')
                ->where('prediccio_proposada_id', $id)
                ->where('validat', true)
                ->first();
    
            if ($existingResult) {
                return response()->json(['error' => 'Esta apuesta ya ha sido verificada'], 400);
            }
    
            // Crear o actualizar el resultado en resultat_prediccio
            $resultatPrediccio = [
                'resultat_prediccio' => $request->resultado === 'ganada' ? 'Guanyat' : 'Perdut',
                'validacio' => $request->comentario ?? 'Verificado por administrador'
            ];
            
            $resultId = DB::table('resultat_prediccio')->insertGetId($resultatPrediccio);
    
            // Actualizar o crear el registro en prediccions_sist
            $prediccionSist = DB::table('prediccions_sist')
                ->where('prediccio_proposada_id', $id)
                ->first();
                
            if ($prediccionSist) {
                DB::table('prediccions_sist')
                    ->where('prediccio_proposada_id', $id)
                    ->update([
                        'resultat_prediccio_id' => $resultId,
                        'validat' => true
                    ]);
            } else {
                DB::table('prediccions_sist')->insert([
                    'prediccio_proposada_id' => $id,
                    'usuari_nick' => $bet->usuari_nick,
                    'resultat_prediccio_id' => $resultId,
                    'punts_apostats' => $bet->punts_proposats,
                    'validat' => true
                ]);
            }
    
            // Si la apuesta es ganada, actualizar el saldo del usuario
            if ($request->resultado === 'ganada') {
                $ganancia = $bet->punts_proposats * $bet->cuota;
                
                // Actualizar el saldo del usuario
                DB::table('usuaris')
                    ->where('nick', $bet->usuari_nick)
                    ->increment('saldo', $ganancia);
                
                // Log the transaction instead of inserting into a non-existent table
                Log::info('Ganancia por apuesta registrada', [
                    'usuario' => $bet->usuari_nick,
                    'apuesta_id' => $id,
                    'ganancia' => $ganancia,
                    'fecha' => now()->toDateTimeString()
                ]);
                
                // Uncomment this if you create the transaccions table later
                /*
                DB::table('transaccions')->insert([
                    'usuari_nick' => $bet->usuari_nick,
                    'tipus' => 'ganancia_apuesta',
                    'quantitat' => $ganancia,
                    'descripcio' => "Ganancia por apuesta #$id",
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
                */
            }
    
            DB::commit();
            return response()->json(['message' => 'Apuesta verificada correctamente']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al verificar apuesta: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json(['error' => 'Error al verificar apuesta: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Obtener historial de apuestas verificadas
     */
    public function getVerifiedBets()
    {
        try {
            $verifiedBets = DB::table('prediccio_proposada')
                ->join('usuaris', 'prediccio_proposada.usuari_nick', '=', 'usuaris.nick')
                ->join('prediccions_sist', 'prediccio_proposada.id', '=', 'prediccions_sist.prediccio_proposada_id')
                ->join('resultat_prediccio', 'prediccions_sist.resultat_prediccio_id', '=', 'resultat_prediccio.id')
                ->where('prediccions_sist.validat', true)
                ->select(
                    'prediccio_proposada.id',
                    'prediccio_proposada.usuari_nick',
                    'prediccio_proposada.cuota',
                    'prediccio_proposada.punts_proposats',
                    'prediccio_proposada.match_info',
                    'prediccio_proposada.prediction_choice',
                    'prediccio_proposada.tipo_apuesta',
                    'prediccio_proposada.created_at as fecha_apuesta',
                    DB::raw('NOW() as fecha_verificacion'), // Fallback if no timestamp in resultat_prediccio
                    'resultat_prediccio.resultat_prediccio as resultado',
                    'resultat_prediccio.validacio as comentari',
                    'usuaris.email'
                )
                ->orderBy('prediccio_proposada.id', 'desc')
                ->get();

            // Para cada apuesta, obtener los detalles y calcular ganancia
            foreach ($verifiedBets as $bet) {
                $bet->detalles = DB::table('detalle_prediccio')
                    ->where('prediccio_proposada_id', $bet->id)
                    ->get();
                
                // Calcular ganancia o pérdida
                if ($bet->resultado === 'Guanyat') {
                    $bet->ganancia = $bet->punts_proposats * $bet->cuota;
                } else {
                    $bet->ganancia = -$bet->punts_proposats;
                }
            }

            return response()->json($verifiedBets);
        } catch (\Exception $e) {
            Log::error('Error al obtener apuestas verificadas: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json(['error' => 'Error al obtener apuestas verificadas: ' . $e->getMessage()], 500);
        }
    }
}