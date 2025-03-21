<?php

namespace App\Http\Controllers;

use App\Models\Premio;
use App\Models\PremioUsuario; // Add this import
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon; // Add this import for Carbon

class PremioController extends Controller
{
    public function index()
    {
        $premios = Premio::all();
        return response()->json($premios);
    }

    public function show($id)
    {
        $premio = Premio::findOrFail($id);
        return response()->json($premio);
    }

    public function canjear(Request $request, $id)
    {
        try {
            // Get authenticated user
            $user = Auth::user();
            if (!$user) {
                return response()->json(['message' => 'Usuario no autenticado'], 401);
            }

            // Get the prize
            $premio = Premio::findOrFail($id);

            // Check if user has enough points
            if ($user->saldo < $premio->cost) {
                return response()->json([
                    'message' => 'No tienes suficientes puntos para canjear este premio'
                ], 400);
            }

            // Create record in premis_usuaris
            $premioUsuario = new PremioUsuario();
            $premioUsuario->usuari_nick = $user->nick;
            $premioUsuario->premi_id = $premio->id;
            $premioUsuario->data_reclamat = Carbon::now();
            $premioUsuario->usat = false;

            // Debug log to check if the model is being created correctly
            Log::info('Creating premio_usuario record', [
                'user' => $user->nick,
                'premio_id' => $premio->id,
                'data_reclamat' => $premioUsuario->data_reclamat,
                'table' => $premioUsuario->getTable(),
                'fillable' => $premioUsuario->getFillable()
            ]);

            try {
                // Save the record with detailed error handling
                $saved = $premioUsuario->save();

                if (!$saved) {
                    Log::error('Failed to save premio_usuario record - save() returned false');
                    return response()->json(['message' => 'Error al guardar el premio canjeado'], 500);
                }
            } catch (\Exception $saveException) {
                Log::error('Exception during save operation: ' . $saveException->getMessage(), [
                    'exception' => get_class($saveException),
                    'trace' => $saveException->getTraceAsString()
                ]);
                return response()->json(['message' => 'Error al guardar el premio canjeado: ' . $saveException->getMessage()], 500);
            }

            // Subtract points from user
            $oldSaldo = $user->saldo;
            $newSaldo = $user->saldo - $premio->cost;

            try {
                // Update user saldo directly with DB query to avoid model issues
                $updated = \Illuminate\Support\Facades\DB::table('usuaris')
                    ->where('nick', $user->nick)
                    ->update(['saldo' => $newSaldo]);

                if (!$updated) {
                    Log::error('Failed to update user saldo in database', [
                        'user_nick' => $user->nick,
                        'old_saldo' => $oldSaldo,
                        'new_saldo' => $newSaldo
                    ]);

                    // Rollback the premio_usuario record
                    $premioUsuario->delete();

                    return response()->json(['message' => 'Error al actualizar el saldo del usuario'], 500);
                }

                // Update the user model to reflect the new balance
                $user->saldo = $newSaldo;

                Log::info('Premio redeemed successfully', [
                    'user' => $user->nick,
                    'premio_id' => $premio->id,
                    'old_saldo' => $oldSaldo,
                    'new_saldo' => $newSaldo
                ]);

                return response()->json([
                    'message' => 'Premio canjeado con éxito',
                    'premio' => $premio,
                    'saldo_actual' => $newSaldo,
                    'premio_usuario_id' => $premioUsuario->id
                ]);

            } catch (\Exception $dbException) {
                Log::error('Database exception during user saldo update: ' . $dbException->getMessage(), [
                    'exception' => get_class($dbException),
                    'trace' => $dbException->getTraceAsString(),
                    'user_nick' => $user->nick
                ]);

                // Rollback the premio_usuario record
                $premioUsuario->delete();

                return response()->json(['message' => 'Error al actualizar el saldo del usuario: ' . $dbException->getMessage()], 500);
            }
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Premio not found: ' . $e->getMessage());
            return response()->json(['message' => 'Premio no encontrado'], 404);
        } catch (\Exception $e) {
            Log::error('Error redeeming premio: ' . $e->getMessage(), [
                'exception' => get_class($e),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Error al canjear el premio: ' . $e->getMessage()], 500);
        }
    }

    // Add this new method to the PremioController class

    public function userPremios()
    {
        // Get authenticated user
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }

        // Get all prizes redeemed by the user with related prize information
        $premiosUsuario = PremioUsuario::where('usuari_nick', $user->nick)
            ->with('premio')
            ->orderBy('data_reclamat', 'desc')
            ->get();

        // Transform the data to include all necessary information
        $premiosData = $premiosUsuario->map(function($premioUsuario) {
            return [
                'id' => $premioUsuario->id,
                'premio_id' => $premioUsuario->premi_id,
                'titulo' => $premioUsuario->premio->titol,
                'descripcion' => $premioUsuario->premio->descripcio,
                'image' => $premioUsuario->premio->image,
                'cost' => $premioUsuario->premio->cost,
                'fecha_canje' => $premioUsuario->data_reclamat,
                'fecha_limite' => $premioUsuario->data_limit,
                'usado' => $premioUsuario->usat ? true : false
            ];
        });

        return response()->json($premiosData);
    }
}