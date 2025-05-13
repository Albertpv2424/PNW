<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Promocion;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PromocionController extends Controller
{
    /**
     * Get all public promociones
     */
    /**
     * Get all public promociones
     */
    public function getPublicPromociones()
    {
        try {
            Log::info('Fetching public promociones');

            // Get active promociones (current date is between start and end date)
            $promociones = Promocion::with('tipoPromocion')
                ->where('data_final', '>=', now())
                ->orderBy('data_inici', 'desc')
                ->get();

            return response()->json($promociones);
        } catch (\Exception $e) {
            Log::error('Error fetching public promociones: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al cargar las promociones: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Handle user inscription to a promotion
     */
    /**
     * Handle user inscription to a promotion
     */
    public function inscribir(Request $request, $id)
    {
        try {
            // Obtener el usuario autenticado
            $user = auth()->user();
            if (!$user) {
                return response()->json([
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            // Verificar si la promoción existe
            $promocion = Promocion::find($id);
            if (!$promocion) {
                return response()->json([
                    'message' => 'Promoción no encontrada'
                ], 404);
            }

            // Verificar si la promoción está activa
            if ($promocion->data_final < now()) {
                return response()->json([
                    'message' => 'Esta promoción ha finalizado'
                ], 400);
            }

            // Obtener la promoción
            $promocion = Promocion::findOrFail($id);
            
            // Verificar si es un bono de bienvenida (comprobando el título)
            $esBonoBienvenida = false;
            
            // Verificar por título (más permisivo)
            if (stripos($promocion->titol, 'bienvenida') !== false || 
                stripos($promocion->titol, 'benvenuto') !== false ||
                $promocion->titol === 'Bono de Bienvenida' ||
                $promocion->titol === 'Bonus di Benvenuto') {
                $esBonoBienvenida = true;
            }
            
            Log::info("Promoción ID {$id} - ¿Es bono de bienvenida?: " . ($esBonoBienvenida ? 'Sí' : 'No'));
            Log::info("Título de la promoción: {$promocion->titol}");
            
            // Verificar si el usuario ya está inscrito
            $inscripcion = InscripcioAPromo::where('usuari_nick', $user->nick)
                ->where('promo_id', $id)
                ->first();

            if ($inscripcion) {
                return response()->json([
                    'message' => 'Ya estás inscrito en esta promoción'
                ], 400);
            }

            // Crear la inscripción
            $inscripcion = new \App\Models\InscripcionPromocion();
            $inscripcion->usuari_nick = $user->nick;
            $inscripcion->promo_id = $id;
            $inscripcion->data_inscripcio = now();
            $inscripcion->compleix_requisits = false; // Por defecto, no cumple requisitos
            $inscripcion->save();

            // Si es un bono de bienvenida, añadir puntos al usuario
            $saldo_actual = null;

            // Cargar la relación tipoPromocion si no está cargada
            if (!$promocion->relationLoaded('tipoPromocion')) {
                $promocion->load('tipoPromocion');
            }

            // Verificar si es un bono de bienvenida (usando la verificación anterior)
            // Mantenemos la variable $esBonoBienvenida que ya se definió arriba
            Log::info("Segunda verificación - Promoción ID {$id} - ¿Es bono de bienvenida?: " . ($esBonoBienvenida ? 'Sí' : 'No'));

            // Añadir puntos si es bono de bienvenida
            if ($esBonoBienvenida) {
                // Registrar el saldo actual antes de la modificación
                Log::info("Saldo actual del usuario {$user->nick} antes de añadir puntos: {$user->saldo}");

                try {
                    // Usar una transacción para garantizar la integridad de los datos
                    DB::beginTransaction();
                    
                    // Actualizar el saldo directamente con una consulta DB usando raw para evitar problemas de concurrencia
                    $updated = DB::table('usuaris')
                        ->where('nick', $user->nick)
                        ->update(['saldo' => DB::raw('saldo + 500')]);
                    
                    if (!$updated) {
                        throw new \Exception("Error al actualizar el saldo del usuario {$user->nick}");
                    }
                    
                    // Obtener el saldo actualizado directamente de la base de datos
                    $updatedUser = DB::table('usuaris')->where('nick', $user->nick)->first();
                    $saldo_actual = $updatedUser->saldo;
                    
                    // Marcar como cumplidos los requisitos
                    DB::table('inscripcio_a_promos')
                        ->where('usuari_nick', $user->nick)
                        ->where('promo_id', $id)
                        ->update(['compleix_requisits' => true]);
                    
                    // Confirmar la transacción
                    DB::commit();
                    
                    Log::info("Saldo actualizado correctamente: {$saldo_actual}");
                    
                    // Devolver respuesta con el saldo actualizado
                    return response()->json([
                        'message' => 'Te has inscrito correctamente al bono de bienvenida y has recibido 500 puntos',
                        'saldo_actual' => $saldo_actual
                    ]);
                } catch (\Exception $e) {
                    // Revertir la transacción en caso de error
                    DB::rollBack();
                    
                    Log::error("Error en la transacción del bono de bienvenida: " . $e->getMessage());
                    return response()->json([
                        'message' => 'Error al procesar el bono de bienvenida: ' . $e->getMessage()
                    ], 500);
                }
            } else {
                Log::info("Inscripción a promoción que no es bono de bienvenida: {$promocion->titol}");
            }

            // Respuesta exitosa
            $response = [
                'message' => 'Te has inscrito correctamente a la promoción'
            ];

            // Añadir el saldo actual si se modificó
            if ($saldo_actual !== null) {
                $response['saldo_actual'] = $saldo_actual;
            }

            return response()->json($response);
        } catch (\Exception $e) {
            Log::error('Error al inscribirse en promoción: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al inscribirse en la promoción: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all promociones
     */
    public function index()
    {
        try {
            Log::info('Fetching all promociones');

            // Get ALL promociones, not just active ones
            $promociones = Promocion::with('tipoPromocion')
                ->orderBy('data_inici', 'desc')
                ->get();
    
            return response()->json($promociones);
        } catch (\Exception $e) {
            Log::error('Error fetching promociones: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al cargar las promociones: ' . $e->getMessage()
            ], 500);
        }
    }
}