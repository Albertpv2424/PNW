<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Promocion;
use App\Models\TipoPromocion;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class PromotionController extends Controller
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
            return $next($request);
        });
    }

    /**
     * Obtener todas las promociones
     */
    public function index()
    {
        $promociones = Promocion::with('tipoPromocion')->get();
        return response()->json($promociones);
    }

    /**
     * Obtener una promoción específica
     */
    public function show($id)
    {
        $promocion = Promocion::with('tipoPromocion')->find($id);

        if (!$promocion) {
            return response()->json(['message' => 'Promoción no encontrada'], 404);
        }

        return response()->json($promocion);
    }

    /**
     * Crear una nueva promoción
     */
    public function store(Request $request)
    {
        // Verify admin permissions
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'No tienes permisos de administrador'], 403);
        }

        $validator = Validator::make($request->all(), [
            'titol' => 'required|string|max:255',
            'descripcio' => 'required|string',
            'data_inici' => 'required|date',
            'data_final' => 'required|date|after_or_equal:data_inici',
            'tipus_promocio_id' => 'required|exists:tipus_promocio,id', // Changed from tipus_promocions to tipus_promocio
            'image' => 'nullable|string|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Debug the incoming request
            Log::info('Promotion creation request received', [
                'all_data' => $request->all(),
                'image' => $request->image
            ]);

            $promotion = new Promocion();
            $promotion->titol = $request->titol;
            $promotion->descripcio = $request->descripcio;
            $promotion->data_inici = $request->data_inici;
            $promotion->data_final = $request->data_final;
            $promotion->tipus_promocio = $request->tipus_promocio_id; // Changed from tipus_promocio_id to tipus_promocio

            // Process the image URL - ensure it's stored properly
            if ($request->image) {
                // If it's already a full URL, store it as is
                if (filter_var($request->image, FILTER_VALIDATE_URL)) {
                    $promotion->image = $request->image;
                }
                // If it's a relative path, store it as is
                else {
                    $promotion->image = $request->image;
                }
            }

            $promotion->save();

            // Debug the saved promotion
            Log::info('Promotion created successfully', [
                'id' => $promotion->id,
                'image' => $promotion->image
            ]);

            return response()->json($promotion, 201);
        } catch (\Exception $e) {
            Log::error('Error creating promotion', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error al crear la promoción: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar una promoción existente
     */
    public function update(Request $request, $id)
    {
        // Verify admin permissions
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'No tienes permisos de administrador'], 403);
        }

        $promotion = Promocion::find($id);

        if (!$promotion) {
            return response()->json(['message' => 'Promoción no encontrada'], 404);
        }

        $validator = Validator::make($request->all(), [
            'titol' => 'required|string|max:255',
            'descripcio' => 'required|string',
            'data_inici' => 'required|date',
            'data_final' => 'required|date|after_or_equal:data_inici',
            'tipus_promocio_id' => 'required|exists:tipus_promocio,id', // Changed from tipus_promocions to tipus_promocio
            'image' => 'nullable|string|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Debug the incoming request
            Log::info('Promotion update request received', [
                'id' => $id,
                'all_data' => $request->all(),
                'image' => $request->image
            ]);

            $promotion->titol = $request->titol;
            $promotion->descripcio = $request->descripcio;
            $promotion->data_inici = $request->data_inici;
            $promotion->data_final = $request->data_final;
            $promotion->tipus_promocio = $request->tipus_promocio_id; // Changed from tipus_promocio_id to tipus_promocio

            // Process the image URL - ensure it's stored properly
            if ($request->image) {
                // If it's already a full URL, store it as is
                if (filter_var($request->image, FILTER_VALIDATE_URL)) {
                    $promotion->image = $request->image;
                }
                // If it's a relative path, store it as is
                else {
                    $promotion->image = $request->image;
                }
            }

            $promotion->save();

            // Debug the saved promotion
            Log::info('Promotion updated successfully', [
                'id' => $promotion->id,
                'image' => $promotion->image
            ]);

            return response()->json($promotion);
        } catch (\Exception $e) {
            Log::error('Error updating promotion', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error al actualizar la promoción: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar una promoción
     */
    public function destroy($id)
    {
        $promocion = Promocion::find($id);

        if (!$promocion) {
            return response()->json(['message' => 'Promoción no encontrada'], 404);
        }

        // Eliminar imagen si existe
        if ($promocion->image && Storage::exists(str_replace('storage/', 'public/', $promocion->image))) {
            Storage::delete(str_replace('storage/', 'public/', $promocion->image));
        }

        $promocion->delete();

        return response()->json(['message' => 'Promoción eliminada con éxito']);
    }

    /**
     * Obtener todos los tipos de promoción
     */
    // Add this method to your PromotionController
    public function getTiposPromocion()
    {
        try {
            $tiposPromocion = \App\Models\TipoPromocion::all();
            return response()->json($tiposPromocion);
        } catch (\Exception $e) {
            Log::error('Error fetching tipos promocion: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al cargar los tipos de promoción: ' . $e->getMessage()
            ], 500);
        }
    }
    /**
     * Check if the current user is an admin
     */
    private function isAdmin()
    {
        $user = Auth::user();
        return $user && in_array(strtolower($user->tipus_acc), ['admin', 'administrador', 'administrator']);
    }
}