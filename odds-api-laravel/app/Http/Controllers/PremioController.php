<?php

namespace App\Http\Controllers;

use App\Models\Premio;
use Illuminate\Http\Request;

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
        // Aquí implementaremos la lógica para canjear un premio
        // Verificar si el usuario tiene suficientes puntos
        // Crear registro en premis_usuaris
        // Restar puntos al usuario
        
        return response()->json(['message' => 'Premio canjeado con éxito']);
    }
}