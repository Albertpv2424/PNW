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
         $request->validate([
             'titol' => 'required|string|max:255',
             'descripcio' => 'nullable|string',
             'data_inici' => 'required|date',
             'data_final' => 'required|date|after_or_equal:data_inici',
             'tipus_promocio' => 'required|exists:tipus_promocio,id',
             'image' => 'nullable|string' // Nom del fitxer o URL de la imatge
         ]);
 
         $promocio = Promocion::create($request->all());
 
         return response()->json(['message' => 'Promoció creada correctament!', 'data' => $promocio], 201);
     }

    /**
     * Actualizar una promoción existente
     */
    public function update(Request $request, $id)
    {
        $promocion = Promocion::find($id);

        if (!$promocion) {
            return response()->json(['message' => 'Promoción no encontrada'], 404);
        }

        $validator = Validator::make($request->all(), [
            'titol' => 'required|string|max:255',
            'descripcio' => 'required|string',
            'data_inici' => 'required|date',
            'data_final' => 'required|date|after_or_equal:data_inici',
            'tipus_promocio' => 'required|exists:tipus_promocio,id', // Changed from tipo_promocion_id
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Error de validación', 'errors' => $validator->errors()], 422);
        }

        $promocion->titol = $request->titol;
        $promocion->descripcio = $request->descripcio;
        $promocion->data_inici = $request->data_inici;
        $promocion->data_final = $request->data_final;
        $promocion->tipus_promocio = $request->tipus_promocio; // Changed from tipo_promocion_id

        if ($request->hasFile('image')) {
            // Eliminar imagen anterior si existe
            if ($promocion->image && Storage::exists(str_replace('storage/', 'public/', $promocion->image))) {
                Storage::delete(str_replace('storage/', 'public/', $promocion->image));
            }

            $imagePath = $request->file('image')->store('public/promociones');
            $promocion->image = str_replace('public/', 'storage/', $imagePath);
        }

        $promocion->save();

        return response()->json(['message' => 'Promoción actualizada con éxito', 'promocion' => $promocion]);
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
}