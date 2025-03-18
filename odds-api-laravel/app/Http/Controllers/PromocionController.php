<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Promocion;
use Illuminate\Support\Facades\Log;

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

            // Verificar si el usuario ya está inscrito
            $inscripcion = \App\Models\InscripcionPromocion::where('usuari_nick', $user->nick)
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

            // Verificar si es un bono de bienvenida (comprobando el título o el ID)
            $esBonoBienvenida = false;

            if ($promocion->tipoPromocion) {
                $esBonoBienvenida = $promocion->tipoPromocion->titol === 'Bono de Bienvenida';
            } else if ($promocion->titol === 'Bono de Bienvenida') {
                $esBonoBienvenida = true;
            }

            // Añadir puntos si es bono de bienvenida
            if ($esBonoBienvenida) {
                // Registrar el saldo actual antes de la modificación
                Log::info("Saldo actual del usuario {$user->nick} antes de añadir puntos: {$user->saldo}");

                // Añadir 500 puntos directamente en la base de datos
                $oldSaldo = $user->saldo;
                $newSaldo = $oldSaldo + 500;

                // Actualizar el saldo directamente con una consulta DB para evitar problemas con el modelo
                $updated = \Illuminate\Support\Facades\DB::table('usuaris')
                    ->where('nick', $user->nick)
                    ->update(['saldo' => $newSaldo]);

                if (!$updated) {
                    Log::error("Error al actualizar el saldo del usuario {$user->nick}");
                } else {
                    $saldo_actual = $newSaldo;
                    Log::info("Saldo actualizado correctamente: {$saldo_actual}");
                }

                // Marcar como cumplidos los requisitos usando la clave primaria compuesta
                \Illuminate\Support\Facades\DB::table('inscripcio_a_promos')
                    ->where('usuari_nick', $user->nick)
                    ->where('promo_id', $id)
                    ->update(['compleix_requisits' => true]);

                // Registrar en el log que se han añadido puntos
                Log::info("Añadidos 500 puntos al usuario {$user->nick} por inscripción a bono de bienvenida");
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

            // Get active promociones (current date is between start and end date)
            $promociones = Promocion::with('tipoPromocion')
                ->where('data_final', '>=', now())
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