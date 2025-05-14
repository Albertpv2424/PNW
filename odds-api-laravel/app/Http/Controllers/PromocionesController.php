<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\Promocion;
use App\Models\InscripcionPromocion;
use Carbon\Carbon;

class PromocionesController extends Controller
{
    /**
     * Obtener todas las promociones con traducciones según el idioma solicitado
     */
    public function index(Request $request)
    {
        // Obtener el código de idioma de la solicitud
        $langCode = $request->query('lang', 'es');

        // Registrar el idioma solicitado para depuración
        Log::info('Idioma solicitado para promociones: ' . $langCode);

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

        // Obtener promociones con traducciones
        $promociones = DB::table('promos')
            ->leftJoin('promos_traduccions', function($join) use ($langId) {
                $join->on('promos.id', '=', 'promos_traduccions.promo_id')
                     ->where('promos_traduccions.idioma_id', '=', $langId);
            })
            ->leftJoin('tipus_promocio', 'promos.tipus_promocio', '=', 'tipus_promocio.id')
            ->select(
                'promos.id',
                DB::raw('COALESCE(promos_traduccions.titol, promos.titol) as titol'),
                DB::raw('COALESCE(promos_traduccions.descripcio, promos.descripcio) as descripcio'),
                'promos.data_inici',
                'promos.data_final',
                'promos.tipus_promocio',
                'tipus_promocio.titol as tipo_promocio_titol',
                'promos.image'
            )
            ->get()
            ->map(function($promo) {
                // Formatear la respuesta para incluir el tipo de promoción como objeto
                return [
                    'id' => $promo->id,
                    'titol' => $promo->titol,
                    'descripcio' => $promo->descripcio,
                    'data_inici' => $promo->data_inici,
                    'data_final' => $promo->data_final,
                    'tipus_promocio' => $promo->tipus_promocio,
                    'tipoPromocion' => $promo->tipus_promocio ? [
                        'id' => $promo->tipus_promocio,
                        'titol' => $promo->tipo_promocio_titol
                    ] : null,
                    'image' => $promo->image
                ];
            });

        // Registrar información detallada sobre las promociones recuperadas
        foreach ($promociones as $index => $promocion) {
            Log::info("Promoción {$index}: ID={$promocion['id']}, Título={$promocion['titol']}");
        }

        Log::info('Recuperadas ' . count($promociones) . ' promociones con traducciones');

        return response()->json($promociones);
    }

    /**
     * Obtener una promoción específica con traducciones
     */
    public function show(Request $request, $id)
    {
        // Obtener el código de idioma de la solicitud
        $langCode = $request->query('lang', 'es');

        // Registrar el idioma solicitado para depuración
        Log::info('Idioma solicitado para promoción ID ' . $id . ': ' . $langCode);

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

        // Obtener promoción con traducciones
        $promocion = DB::table('promos')
            ->leftJoin('promos_traduccions', function($join) use ($langId) {
                $join->on('promos.id', '=', 'promos_traduccions.promo_id')
                     ->where('promos_traduccions.idioma_id', '=', $langId);
            })
            ->leftJoin('tipus_promocio', 'promos.tipus_promocio', '=', 'tipus_promocio.id')
            ->select(
                'promos.id',
                DB::raw('COALESCE(promos_traduccions.titol, promos.titol) as titol'),
                DB::raw('COALESCE(promos_traduccions.descripcio, promos.descripcio) as descripcio'),
                'promos.data_inici',
                'promos.data_final',
                'promos.tipus_promocio',
                'tipus_promocio.titol as tipo_promocio_titol',
                'promos.image'
            )
            ->where('promos.id', $id)
            ->first();

        if (!$promocion) {
            return response()->json(['message' => 'Promoción no encontrada'], 404);
        }

        // Formatear la respuesta para incluir el tipo de promoción como objeto
        $result = [
            'id' => $promocion->id,
            'titol' => $promocion->titol,
            'descripcio' => $promocion->descripcio,
            'data_inici' => $promocion->data_inici,
            'data_final' => $promocion->data_final,
            'tipus_promocio' => $promocion->tipus_promocio,
            'tipoPromocion' => $promocion->tipus_promocio ? [
                'id' => $promocion->tipus_promocio,
                'titol' => $promocion->tipo_promocio_titol
            ] : null,
            'image' => $promocion->image
        ];

        return response()->json($result);
    }

    /**
     * Inscribir al usuario autenticado en una promoción
     */
    public function inscribir(Request $request, $id)
    {
        // Verificar que el usuario esté autenticado
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }

        // Verificar que la promoción exista
        $promocion = Promocion::find($id);
        if (!$promocion) {
            return response()->json(['message' => 'Promoción no encontrada'], 404);
        }

        // Verificar si la promoción está activa
        $now = Carbon::now();
        $startDate = Carbon::parse($promocion->data_inici);
        $endDate = Carbon::parse($promocion->data_final);

        if ($now->lt($startDate) || $now->gt($endDate)) {
            return response()->json(['message' => 'La promoción no está activa actualmente'], 400);
        }

        // Verificar si el usuario ya está inscrito
        $inscripcion = InscripcionPromocion::where('usuari_nick', $user->nick)
            ->where('promo_id', $id)
            ->first();

        if ($inscripcion) {
            return response()->json(['message' => 'Ya estás inscrito en esta promoción'], 400);
        }

        // Crear la inscripción
        $inscripcion = new InscripcionPromocion();
        $inscripcion->usuari_nick = $user->nick;
        $inscripcion->promo_id = $id;
        $inscripcion->data_inscripcio = Carbon::now();
        $inscripcion->compleix_requisits = false; // Por defecto, no cumple requisitos
        $inscripcion->save();

        return response()->json([
            'message' => '¡Te has inscrito correctamente en la promoción!',
            'inscripcion' => [
                'usuario' => $user->nick,
                'promocion_id' => $id,
                'fecha_inscripcion' => $inscripcion->data_inscripcio
            ]
        ], 201);
    }

    /**
     * Obtener las inscripciones del usuario autenticado
     */
    public function userInscripciones(Request $request)
    {
        // Verificar que el usuario esté autenticado
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }

        // Obtener el código de idioma de la solicitud
        $langCode = $request->query('lang', 'es');

        // Obtener el ID del idioma de la tabla idiomas
        $language = DB::table('idiomas')
            ->where('codigo_iso', $langCode)
            ->first();

        if (!$language) {
            $langId = 1; // Español por defecto
        } else {
            $langId = $language->id;
        }

        // Obtener las inscripciones del usuario con detalles de las promociones
        $inscripciones = DB::table('inscripcio_a_promos')
            ->join('promos', 'inscripcio_a_promos.promo_id', '=', 'promos.id')
            ->leftJoin('promos_traduccions', function($join) use ($langId) {
                $join->on('promos.id', '=', 'promos_traduccions.promo_id')
                     ->where('promos_traduccions.idioma_id', '=', $langId);
            })
            ->leftJoin('tipus_promocio', 'promos.tipus_promocio', '=', 'tipus_promocio.id')
            ->where('inscripcio_a_promos.usuari_nick', $user->nick)
            ->select(
                'inscripcio_a_promos.promo_id',
                DB::raw('COALESCE(promos_traduccions.titol, promos.titol) as titol'),
                DB::raw('COALESCE(promos_traduccions.descripcio, promos.descripcio) as descripcio'),
                'promos.data_inici',
                'promos.data_final',
                'tipus_promocio.titol as tipo_promocio',
                'promos.image',
                'inscripcio_a_promos.data_inscripcio',
                'inscripcio_a_promos.compleix_requisits'
            )
            ->orderBy('inscripcio_a_promos.data_inscripcio', 'desc')
            ->get();

        return response()->json($inscripciones);
    }

    /**
     * Método específico para inscribir al usuario en el bono de bienvenida
     * y otorgarle 500 puntos directamente
     */
    public function inscribirBonoBienvenida(Request $request)
    {
        try {
            // Obtener el usuario autenticado
            $user = auth()->user();
            if (!$user) {
                return response()->json([
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            // Buscar la promoción de bono de bienvenida
            $promocion = \App\Models\Promocion::where('titol', 'like', '%bono de bienvenida%')
                ->orWhere('titol', 'like', '%Bono de Bienvenida%')
                ->first();

            if (!$promocion) {
                return response()->json([
                    'message' => 'Promoción de bono de bienvenida no encontrada'
                ], 404);
            }

            // Verificar si el usuario ya está inscrito
            $inscripcion = \App\Models\InscripcionPromocion::where('usuari_nick', $user->nick)
                ->where('promo_id', $promocion->id)
                ->first();

            if ($inscripcion) {
                return response()->json([
                    'message' => 'Ya estás inscrito en esta promoción'
                ], 400);
            }

            // Registrar la inscripción
            $inscripcion = new \App\Models\InscripcionPromocion();
            $inscripcion->usuari_nick = $user->nick;
            $inscripcion->promo_id = $promocion->id;
            $inscripcion->data_inscripcio = now();
            $inscripcion->compleix_requisits = true; // Ya cumple requisitos
            $inscripcion->save();

            // Obtener el saldo actual para logging
            $oldSaldo = $user->saldo;

            // Actualizar el saldo directamente en la base de datos
            DB::table('usuaris')
                ->where('nick', $user->nick)
                ->update(['saldo' => DB::raw('saldo + 500')]);

            // Obtener el saldo actualizado
            $updatedUser = DB::table('usuaris')->where('nick', $user->nick)->first();
            $newSaldo = $updatedUser->saldo;

            // Actualizar el modelo del usuario
            $user->saldo = $newSaldo;

            // Registrar en el log
            Log::info("BONO BIENVENIDA: Añadidos 500 puntos al usuario {$user->nick}. Saldo anterior: {$oldSaldo}, Nuevo saldo: {$newSaldo}");

            return response()->json([
                'message' => 'Te has inscrito correctamente al bono de bienvenida y has recibido 500 puntos',
                'saldo_actual' => $newSaldo
            ]);

        } catch (\Exception $e) {
            Log::error('Error al inscribirse en bono de bienvenida: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());

            return response()->json([
                'message' => 'Error al inscribirse en la promoción: ' . $e->getMessage()
            ], 500);
        }
    }
}