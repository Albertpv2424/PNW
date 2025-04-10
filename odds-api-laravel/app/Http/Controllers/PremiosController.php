<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Auth;
use App\Models\Premio;
use App\Models\PremioUsuario;
use Carbon\Carbon;

class PremiosController extends Controller
{
    public function index(Request $request)
    {
        // Obtener el código de idioma de la solicitud
        $langCode = $request->query('lang', 'es');
        
        // Registrar el idioma solicitado para depuración
        Log::info('Idioma solicitado para premios: ' . $langCode);
        
        // Obtener el ID del idioma de la tabla idiomas
        $language = DB::table('idiomas')
            ->where('codigo_iso', $langCode)
            ->first();
            
        if (!$language) {
            Log::warning('Idioma no encontrado: ' . $langCode . ', usando español por defecto');
            $langId = 1; // Español por defecto
        } else {
            $langId = $language->id;
            Log::info('ID de idioma encontrado: ' . $langId);
        }
        
        // Verificar si hay traducciones para este idioma
        $translationCount = DB::table('premis_traduccions')
            ->where('idioma_id', $langId)
            ->count();
        
        Log::info('Número de traducciones encontradas para idioma ' . $langId . ': ' . $translationCount);
        
        // Obtener premios con traducciones
        $premios = DB::table('premis')
            ->leftJoin('premis_traduccions', function($join) use ($langId) {
                $join->on('premis.id', '=', 'premis_traduccions.premi_id')
                     ->where('premis_traduccions.idioma_id', '=', $langId);
            })
            ->select(
                'premis.id',
                DB::raw('COALESCE(premis_traduccions.titol, premis.titol) as titol'),
                DB::raw('COALESCE(premis_traduccions.descripcio, premis.descripcio) as descripcio'),
                'premis.cost',
                'premis.condicio',
                'premis.image'
            )
            ->get();
        
        // Registrar información detallada sobre los premios recuperados
        foreach ($premios as $index => $premio) {
            Log::info("Premio {$index}: ID={$premio->id}, Título={$premio->titol}");
        }
        
        Log::info('Recuperados ' . count($premios) . ' premios con traducciones');
        
        return response()->json($premios);
    }
    
    // Añade el método show
    public function show(Request $request, $id)
    {
        // Obtener el código de idioma de la solicitud
        $langCode = $request->query('lang', 'es');
        
        // Registrar el idioma solicitado para depuración
        Log::info('Idioma solicitado para premio ID ' . $id . ': ' . $langCode);
        
        // Obtener el ID del idioma de la tabla idiomas
        $language = DB::table('idiomas')
            ->where('codigo_iso', $langCode)
            ->first();
            
        if (!$language) {
            Log::warning('Idioma no encontrado: ' . $langCode . ', usando español por defecto');
            $langId = 1; // Español por defecto
        } else {
            $langId = $language->id;
            Log::info('ID de idioma encontrado: ' . $langId);
        }
        
        // Obtener premio con traducciones
        $premio = DB::table('premis')
            ->leftJoin('premis_traduccions', function($join) use ($langId) {
                $join->on('premis.id', '=', 'premis_traduccions.premi_id')
                     ->where('premis_traduccions.idioma_id', '=', $langId);
            })
            ->select(
                'premis.id',
                DB::raw('COALESCE(premis_traduccions.titol, premis.titol) as titol'),
                DB::raw('COALESCE(premis_traduccions.descripcio, premis.descripcio) as descripcio'),
                'premis.cost',
                'premis.condicio',
                'premis.image'
            )
            ->where('premis.id', $id)
            ->first();
        
        if (!$premio) {
            return response()->json(['error' => 'Premio no encontrado'], 404);
        }
        
        Log::info("Premio recuperado: ID={$premio->id}, Título={$premio->titol}");
        
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
    
    // Add this method before the userPremiosTranslated method
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
    
    // Update the userPremiosTranslated method to fix the error
    public function userPremiosTranslated(Request $request)
    {
        // Get authenticated user
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }
    
        // Get language code from request
        $langCode = $request->query('lang', 'es');
        Log::info('Language requested for user prizes: ' . $langCode);
        
        // Get language ID from database
        $language = DB::table('idiomas')
            ->where('codigo_iso', $langCode)
            ->first();
            
        if (!$language) {
            Log::warning('Idioma no encontrado: ' . $langCode . ', usando español por defecto');
            $langId = 1; // Spanish by default
        } else {
            $langId = $language->id;
            Log::info('ID de idioma encontrado para userPremiosTranslated: ' . $langId);
        }
    
        try {
            // Check if the table exists
            if (!Schema::hasTable('premis_usuaris')) {
                Log::error('Table premis_usuaris does not exist');
                return response()->json(['message' => 'Error interno del servidor: tabla no encontrada'], 500);
            }
    
            // Get all prizes redeemed by the user with translations using DB query builder
            $premiosUsuario = DB::table('premis_usuaris')
                ->join('premis', 'premis_usuaris.premi_id', '=', 'premis.id')
                ->leftJoin('premis_traduccions', function($join) use ($langId) {
                    $join->on('premis.id', '=', 'premis_traduccions.premi_id')
                         ->where('premis_traduccions.idioma_id', '=', $langId);
                })
                ->where('premis_usuaris.usuari_nick', $user->nick)
                ->select(
                    'premis_usuaris.id',
                    'premis_usuaris.premi_id',
                    DB::raw('COALESCE(premis_traduccions.titol, premis.titol) as titulo'),
                    DB::raw('COALESCE(premis_traduccions.descripcio, premis.descripcio) as descripcion'),
                    'premis.image',
                    'premis.cost',
                    'premis_usuaris.data_reclamat as fecha_canje',
                    'premis_usuaris.data_limit as fecha_limite',
                    DB::raw('premis_usuaris.usat as usado')
                )
                ->orderBy('premis_usuaris.data_reclamat', 'desc')
                ->get();
    
            Log::info('Recuperados ' . count($premiosUsuario) . ' premios traducidos para el usuario ' . $user->nick . ' en idioma ' . $langCode);
    
            return response()->json($premiosUsuario);
        } catch (\Exception $e) {
            Log::error('Error in userPremiosTranslated: ' . $e->getMessage(), [
                'exception' => get_class($e),
                'trace' => $e->getTraceAsString(),
                'user_nick' => $user->nick
            ]);
            
            return response()->json(['message' => 'Error al obtener premios del usuario: ' . $e->getMessage()], 500);
        }
    }
    
    public function checkTranslations()
    {
        // Verificar estructura de la tabla
        $hasTable = Schema::hasTable('premis_traduccions');
        Log::info('¿Existe la tabla premis_traduccions? ' . ($hasTable ? 'Sí' : 'No'));
        
        if (!$hasTable) {
            return response()->json(['error' => 'La tabla premis_traduccions no existe'], 500);
        }
        
        // Obtener todos los idiomas
        $idiomas = DB::table('idiomas')->get();
        Log::info('Idiomas disponibles: ' . $idiomas->count());
        
        // Verificar traducciones por idioma
        $result = [];
        foreach ($idiomas as $idioma) {
            $count = DB::table('premis_traduccions')
                ->where('idioma_id', $idioma->id)
                ->count();
            
            $result[] = [
                'idioma' => $idioma->codigo_iso,
                'id' => $idioma->id,
                'traducciones' => $count
            ];
            
            Log::info("Idioma {$idioma->codigo_iso} (ID: {$idioma->id}): {$count} traducciones");
        }
        
        // Verificar algunos ejemplos de traducciones
        $ejemplos = DB::table('premis_traduccions')
            ->join('idiomas', 'premis_traduccions.idioma_id', '=', 'idiomas.id')
            ->join('premis', 'premis_traduccions.premi_id', '=', 'premis.id')
            ->select(
                'premis_traduccions.id',
                'premis_traduccions.premi_id',
                'premis.titol as titulo_original',
                'premis_traduccions.titol as titulo_traducido',
                'idiomas.codigo_iso as idioma'
            )
            ->limit(5)
            ->get();
        
        return response()->json([
            'idiomas' => $result,
            'ejemplos' => $ejemplos
        ]);
    }
}