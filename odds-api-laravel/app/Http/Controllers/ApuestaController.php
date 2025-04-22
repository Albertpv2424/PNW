<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use App\Models\DailyRewardsTracking;

class ApuestaController extends Controller
{
    /**
     * Verificar si el usuario ha alcanzado sus límites de apuestas
     */
    private function checkUserLimitations($user)
    {
        $today = Carbon::today();
        
        // Obtener o crear registro de seguimiento diario
        $dailyTracking = DailyRewardsTracking::firstOrCreate(
            ['usuari_nick' => $user->nick, 'date' => $today],
            [
                'bets_today' => 0,
                'max_daily_bets' => 5, // Valor predeterminado
                'betting_time_today' => 0,
                'max_daily_betting_time' => 3600 // 1 hora en segundos
            ]
        );
        
        // Verificar límite diario de apuestas
        if ($dailyTracking->bets_today >= $dailyTracking->max_daily_bets) {
            return [
                'limited' => true,
                'reason' => 'betting_limit',
                'message' => 'Has alcanzado el límite diario de apuestas',
                'remaining_bets' => 0,
                'max_daily_bets' => $dailyTracking->max_daily_bets
            ];
        }
        
        // Verificar límite diario de tiempo
        if ($dailyTracking->betting_time_today >= $dailyTracking->max_daily_betting_time) {
            return [
                'limited' => true,
                'reason' => 'time_limit',
                'message' => 'Has alcanzado el límite diario de tiempo de apuestas',
                'remaining_time' => 0,
                'max_daily_betting_time' => $dailyTracking->max_daily_betting_time
            ];
        }
        
        return [
            'limited' => false,
            'remaining_bets' => $dailyTracking->max_daily_bets - $dailyTracking->bets_today,
            'remaining_time' => $dailyTracking->max_daily_betting_time - $dailyTracking->betting_time_today,
            'tracking' => $dailyTracking
        ];
    }

    public function registrarApuesta(Request $request)
    {
        // Log the incoming request for debugging
        Log::info('Apuesta request received', ['data' => $request->all()]);

        // Validar los datos de entrada
        $validator = Validator::make($request->all(), [
            'cuota' => 'required|numeric|min:1',
            'punts_proposats' => 'required|numeric|min:1',
            'selecciones' => 'required|array|min:1',
            'selecciones.*.matchId' => 'required|string',
            'selecciones.*.teamName' => 'required|string',
            'selecciones.*.betType' => 'required|string',
            'selecciones.*.odds' => 'required|numeric',
            'selecciones.*.matchInfo' => 'required|string',
            'tipo_apuesta' => 'required|string|in:simple,parlay',
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed', ['errors' => $validator->errors()]);
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Obtener el usuario autenticado
        $usuario = Auth::user();
        if (!$usuario) {
            Log::error('User not authenticated');
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        // Verificar limitaciones de apuestas
        $limitCheck = $this->checkUserLimitations($usuario);
        if ($limitCheck['limited']) {
            Log::warning('User reached betting limits', [
                'user' => $usuario->nick,
                'reason' => $limitCheck['reason'],
                'message' => $limitCheck['message']
            ]);
            return response()->json(['error' => $limitCheck['message']], 403);
        }

        try {
            // Iniciar transacción
            DB::beginTransaction();

            Log::info('Starting transaction for bet', [
                'user' => $usuario->nick,
                'amount' => $request->punts_proposats,
                'odds' => $request->cuota
            ]);

            // Extract match info from the first selection or create a combined string
            $matchInfo = '';
            if (count($request->selecciones) === 1) {
                $matchInfo = $request->selecciones[0]['matchInfo'];
            } else {
                // For combined bets, create a summary of all matches
                $matchInfoArray = array_map(function($seleccion) {
                    return $seleccion['matchInfo'];
                }, $request->selecciones);
                $matchInfo = implode(' + ', $matchInfoArray);
            }

            // Check if tipo_apuesta column exists
            $hasColumn = Schema::hasColumn('prediccio_proposada', 'tipo_apuesta');

            // Crear la predicción propuesta
            $data = [
                'usuari_nick' => $usuario->nick,
                'cuota' => $request->cuota,
                'punts_proposats' => $request->punts_proposats,
                'match_info' => $matchInfo, // Add match info here
            ];

            // Add prediction choice for single bets
            if (count($request->selecciones) === 1) {
                $data['prediction_choice'] = $request->selecciones[0]['teamName'];
            } else {
                // For combined bets, store a summary of all selections
                if (count($request->selecciones) === 1) {
                    $data['prediction_choice'] = $request->selecciones[0]['teamName'];
                } else {
                    // Create a summary of all teams selected in the combined bet
                    $teamSelections = array_map(function($seleccion) {
                        return $seleccion['teamName'];
                    }, $request->selecciones);

                    // Join all team names with a separator
                    $data['prediction_choice'] = implode(' + ', $teamSelections);
                }
            }

            // Only add tipo_apuesta if the column exists
            if ($hasColumn) {
                $data['tipo_apuesta'] = $request->tipo_apuesta;
            }

            // Add timestamps if they exist
            if (Schema::hasColumn('prediccio_proposada', 'created_at')) {
                $data['created_at'] = now();
            }

            if (Schema::hasColumn('prediccio_proposada', 'updated_at')) {
                $data['updated_at'] = now();
            }

            $prediccionPropuesta = DB::table('prediccio_proposada')->insertGetId($data);

            Log::info('Created prediccio_proposada', ['id' => $prediccionPropuesta]);

            // Insertar los detalles de la predicción
            foreach ($request->selecciones as $seleccion) {
                DB::table('detalle_prediccio')->insert([
                    'prediccio_proposada_id' => $prediccionPropuesta,
                    'match_id' => $seleccion['matchId'],
                    'equipo' => $seleccion['teamName'],
                    'tipo_apuesta' => $seleccion['betType'],
                    'cuota' => $seleccion['odds'],
                    'match_info' => $seleccion['matchInfo'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            Log::info('Inserted bet details');

            // Restar puntos al usuario
            // Get the user's current saldo and log it for debugging
            $oldSaldo = DB::table('usuaris')->where('nick', $usuario->nick)->value('saldo');
            Log::info('Current user saldo before update', [
                'user' => $usuario->nick,
                'saldo' => $oldSaldo,
                'type' => gettype($oldSaldo)
            ]);

            // Convert to float to ensure proper calculation
            $oldSaldo = (float) $oldSaldo;
            $puntsProposats = (float) $request->punts_proposats;
            $newSaldo = $oldSaldo - $puntsProposats;

            // Ensure we're not going negative
            if ($newSaldo < 0) {
                throw new \Exception('Saldo insuficiente para realizar esta apuesta');
            }

            // Use raw DB query to update saldo
            $updated = DB::statement("UPDATE usuaris SET saldo = ? WHERE nick = ?", [$newSaldo, $usuario->nick]);

            if (!$updated) {
                throw new \Exception('No se pudo actualizar el saldo del usuario');
            }

            // Actualizar contadores de apuestas y tiempo
            $dailyTracking = $limitCheck['tracking'];
            $dailyTracking->bets_today += 1;
            $dailyTracking->betting_time_today += 60; // Añadir 1 minuto por apuesta
            $dailyTracking->save();

            // Verify the update worked by fetching the new saldo
            $verifiedSaldo = DB::table('usuaris')->where('nick', $usuario->nick)->value('saldo');
            Log::info('Updated user points', [
                'user' => $usuario->nick,
                'old_saldo' => $oldSaldo,
                'new_saldo' => $newSaldo,
                'verified_saldo' => $verifiedSaldo,
                'deducted' => $puntsProposats
            ]);

            // Confirmar transacción
            DB::commit();
            Log::info('Transaction committed successfully');

            return response()->json([
                'message' => 'Apuesta registrada con éxito', 
                'id' => $prediccionPropuesta,
                'remaining_bets' => $dailyTracking->max_daily_bets - $dailyTracking->bets_today,
                'remaining_time' => $dailyTracking->max_daily_betting_time - $dailyTracking->betting_time_today
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error registering bet', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);
            return response()->json(['error' => 'Error al registrar la apuesta: ' . $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $user = auth()->user();
            
            if (!$user) {
                return response()->json(['error' => 'Usuario no autenticado'], 401);
            }
            
            // Iniciar transacción
            DB::beginTransaction();
            
            $today = Carbon::today();

            // Get or create daily tracking record
            $dailyTracking = DailyRewardsTracking::firstOrCreate(
                ['usuari_nick' => $user->nick, 'date' => $today],
                [
                    'bets_today' => 0,
                    'max_daily_bets' => 5, // Default value
                    'betting_time_today' => 0,
                    'max_daily_betting_time' => 3600 // Default: 1 hour in seconds
                ]
            );

            // Check daily bet limit
            if ($dailyTracking->bets_today >= $dailyTracking->max_daily_bets) {
                DB::rollBack();
                return response()->json([
                    'error' => 'Has alcanzado el límite diario de apuestas'
                ], 403);
            }

            // Check daily time limit
            if ($dailyTracking->betting_time_today >= $dailyTracking->max_daily_betting_time) {
                DB::rollBack();
                return response()->json([
                    'error' => 'Has alcanzado el límite diario de tiempo de apuestas'
                ], 403);
            }
            
            // Validate request data
            $validator = Validator::make($request->all(), [
                'cuota' => 'required|numeric|min:1',
                'punts_proposats' => 'required|numeric|min:1',
                'selecciones' => 'required|array|min:1',
                'selecciones.*.matchId' => 'required|string',
                'selecciones.*.teamName' => 'required|string',
                'selecciones.*.betType' => 'required|string',
                'selecciones.*.odds' => 'required|numeric',
                'selecciones.*.matchInfo' => 'required|string',
                'tipo_apuesta' => 'required|string|in:simple,parlay',
            ]);

            if ($validator->fails()) {
                DB::rollBack();
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Extract match info from the first selection or create a combined string
            $matchInfo = '';
            if (count($request->selecciones) === 1) {
                $matchInfo = $request->selecciones[0]['matchInfo'];
            } else {
                // For combined bets, create a summary of all matches
                $matchInfoArray = array_map(function($seleccion) {
                    return $seleccion['matchInfo'];
                }, $request->selecciones);
                $matchInfo = implode(' + ', $matchInfoArray);
            }

            // Check if tipo_apuesta column exists
            $hasColumn = Schema::hasColumn('prediccio_proposada', 'tipo_apuesta');

            // Crear la predicción propuesta
            $data = [
                'usuari_nick' => $user->nick,
                'cuota' => $request->cuota,
                'punts_proposats' => $request->punts_proposats,
                'match_info' => $matchInfo, // Add match info here
            ];

            // Add prediction choice for single bets
            if (count($request->selecciones) === 1) {
                $data['prediction_choice'] = $request->selecciones[0]['teamName'];
            } else {
                // For combined bets, store "Combinada" or a summary
                $data['prediction_choice'] = 'Combinada';
            }

            // Only add tipo_apuesta if the column exists
            if ($hasColumn) {
                $data['tipo_apuesta'] = $request->tipo_apuesta;
            }

            // Add timestamps if they exist
            if (Schema::hasColumn('prediccio_proposada', 'created_at')) {
                $data['created_at'] = now();
            }

            if (Schema::hasColumn('prediccio_proposada', 'updated_at')) {
                $data['updated_at'] = now();
            }

            $prediccionPropuesta = DB::table('prediccio_proposada')->insertGetId($data);

            Log::info('Created prediccio_proposada', ['id' => $prediccionPropuesta]);

            // Insertar los detalles de la predicción
            foreach ($request->selecciones as $seleccion) {
                DB::table('detalle_prediccio')->insert([
                    'prediccio_proposada_id' => $prediccionPropuesta,
                    'match_id' => $seleccion['matchId'],
                    'equipo' => $seleccion['teamName'],
                    'tipo_apuesta' => $seleccion['betType'],
                    'cuota' => $seleccion['odds'],
                    'match_info' => $seleccion['matchInfo'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // Restar puntos al usuario
            $oldSaldo = DB::table('usuaris')->where('nick', $user->nick)->value('saldo');
            
            // Convert to float to ensure proper calculation
            $oldSaldo = (float) $oldSaldo;
            $puntsProposats = (float) $request->punts_proposats;
            $newSaldo = $oldSaldo - $puntsProposats;

            // Ensure we're not going negative
            if ($newSaldo < 0) {
                DB::rollBack();
                throw new \Exception('Saldo insuficiente para realizar esta apuesta');
            }

            // Use raw DB query to update saldo 
            $updated = DB::statement("UPDATE usuaris SET saldo = ? WHERE nick = ?", [$newSaldo, $user->nick]);

            if (!$updated) {
                DB::rollBack();
                throw new \Exception('No se pudo actualizar el saldo del usuario');
            }

            // Update betting counters
            $dailyTracking->bets_today += 1;
            $dailyTracking->betting_time_today += 60; // Add 1 minute per bet
            $dailyTracking->save();

            // Confirmar transacción
            DB::commit();
            Log::info('Transaction committed successfully');

            return response()->json([
                'message' => 'Apuesta registrada con éxito', 
                'id' => $prediccionPropuesta,
                'remaining_bets' => $dailyTracking->max_daily_bets - $dailyTracking->bets_today,
                'remaining_time' => $dailyTracking->max_daily_betting_time - $dailyTracking->betting_time_today
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error registering bet', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);
            return response()->json(['error' => 'Error al registrar la apuesta: ' . $e->getMessage()], 500);
        }
    }
}