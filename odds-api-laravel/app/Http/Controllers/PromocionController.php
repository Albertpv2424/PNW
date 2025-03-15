<?php

namespace App\Http\Controllers;

use App\Models\Promocion;
use App\Models\InscripcionPromocion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class PromocionController extends Controller
{
    public function index()
    {
        // Get all promotions with their type
        $promociones = Promocion::with('tipoPromocion')->get();
        return response()->json($promociones);
    }

    public function show($id)
    {
        $promocion = Promocion::with('tipoPromocion')->findOrFail($id);
        return response()->json($promocion);
    }

    public function inscribir(Request $request, $id)
    {
        try {
            // Intenta obtener el usuario autenticado
            $user = Auth::user();

            // Si no hay usuario autenticado, intenta autenticar con el token del cuerpo
            if (!$user && $request->has('token')) {
                // Intenta autenticar con el token del cuerpo
                $token = $request->input('token');
                $user = \Laravel\Sanctum\PersonalAccessToken::findToken($token)?->tokenable;

                if ($user) {
                    Auth::login($user);
                }
            }

            if (!$user) {
                return response()->json(['message' => 'Usuario no autenticado'], 401);
            }

            // Get the promotion
            $promocion = Promocion::findOrFail($id);

            // Check if promotion is still active
            $now = Carbon::now();
            $startDate = Carbon::parse($promocion->data_inici);
            $endDate = Carbon::parse($promocion->data_final);

            if ($now->lt($startDate) || $now->gt($endDate)) {
                return response()->json([
                    'message' => 'Esta promoción no está activa actualmente'
                ], 400);
            }

            // Check if user is already registered for this promotion
            $existingInscription = InscripcionPromocion::where('usuari_nick', $user->nick)
                ->where('promo_id', $promocion->id)
                ->first();

            if ($existingInscription) {
                return response()->json([
                    'message' => 'Ya estás inscrito en esta promoción'
                ], 400);
            }

            // Create new inscription
            $inscripcion = new InscripcionPromocion();
            $inscripcion->usuari_nick = $user->nick;
            $inscripcion->promo_id = $promocion->id;
            $inscripcion->data_inscripcio = Carbon::now();
            $inscripcion->save();

            // Apply promotion benefits if applicable (for example, welcome bonus)
            if ($promocion->tipus_promocio == 1 && $promocion->titol === 'Bono de Bienvenida') {
                // Add welcome bonus points (500 points)
                $user->saldo += 500;
                $user->save();

                return response()->json([
                    'message' => 'Te has inscrito a la promoción con éxito. Has recibido 500 puntos de bienvenida',
                    'saldo_actual' => $user->saldo
                ]);
            }

            return response()->json([
                'message' => 'Te has inscrito a la promoción con éxito'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al inscribirse en la promoción: ' . $e->getMessage()
            ], 500);
        }
    }
}