<?php

namespace App\Http\Controllers;

use App\Models\Promocion;
use Illuminate\Http\Request;

class PromocionController extends Controller
{
    public function index()
    {
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
        // Implementar lógica para inscribir a un usuario en una promoción
        
        return response()->json(['message' => 'Inscripción realizada con éxito']);
    }
}