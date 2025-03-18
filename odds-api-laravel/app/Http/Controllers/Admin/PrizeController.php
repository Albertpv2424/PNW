<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Premio;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PrizeController extends Controller
{
    /**
     * Constructor para aplicar middleware de autenticación
     */
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        // Registrar cada solicitud para depuración
        Log::info('Admin PrizeController inicializado');
    }

    /**
     * Verificar si el usuario es administrador
     */
    private function isAdmin()
    {
        $user = Auth::user();
        Log::info('Verificando permisos de administrador para usuario: ', [
            'user' => $user ? $user->nick : 'No autenticado',
            'tipus_acc' => $user ? $user->tipus_acc : 'N/A'
        ]);

        // More flexible check for admin status
        if (!$user) {
            return false;
        }

        $userType = strtolower($user->tipus_acc);
        Log::info('User type (lowercase): ' . $userType);

        // Check for various admin type strings (case-insensitive)
        return in_array($userType, ['admin', 'administrador', 'administrator']);
    }

    /**
     * Display a listing of the prizes.
     */
    public function index()
    {
        if (!$this->isAdmin()) {
            Log::warning('Intento de acceso no autorizado a premios por usuario no administrador');
            return response()->json(['message' => 'No tienes permisos de administrador'], 403);
        }

        $prizes = Premio::all();
        return response()->json($prizes);
    }

    /**
     * Get a specific prize
     */
    public function show($id)
    {
        // Verify admin permissions
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'No tienes permisos de administrador'], 403);
        }

        $prize = Premio::find($id);

        if (!$prize) {
            return response()->json(['message' => 'Premio no encontrado'], 404);
        }

        return response()->json($prize);
    }

    /**
     * Create a new prize
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
            'cost' => 'required|numeric|min:1',
            'condicio' => 'required|numeric|min:1',
            'image' => 'nullable|image|max:2048', // 2MB max
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $prize = new Premio();
        $prize->titol = $request->titol;
        $prize->descripcio = $request->descripcio;
        $prize->cost = $request->cost;
        $prize->condicio = $request->condicio;

        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();

            // Ensure directory exists
            if (!file_exists(public_path('uploads/prizes'))) {
                mkdir(public_path('uploads/prizes'), 0755, true);
            }

            $image->move(public_path('uploads/prizes'), $imageName);
            $prize->image = 'uploads/prizes/' . $imageName;
        }

        $prize->save();

        return response()->json($prize, 201);
    }

    /**
     * Update a prize
     */
    public function update(Request $request, $id)
    {
        // Verify admin permissions
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'No tienes permisos de administrador'], 403);
        }

        $prize = Premio::find($id);

        if (!$prize) {
            return response()->json(['message' => 'Premio no encontrado'], 404);
        }

        $validator = Validator::make($request->all(), [
            'titol' => 'required|string|max:255',
            'descripcio' => 'required|string',
            'cost' => 'required|numeric|min:1',
            'condicio' => 'required|numeric|min:1',
            'image' => 'nullable|image|max:2048', // 2MB max
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $prize->titol = $request->titol;
        $prize->descripcio = $request->descripcio;
        $prize->cost = $request->cost;
        $prize->condicio = $request->condicio;

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($prize->image && file_exists(public_path($prize->image))) {
                unlink(public_path($prize->image));
            }

            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('uploads/prizes'), $imageName);
            $prize->image = 'uploads/prizes/' . $imageName;
        }

        $prize->save();

        return response()->json($prize);
    }

    /**
     * Delete a prize
     */
    public function destroy($id)
    {
        // Verify admin permissions
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'No tienes permisos de administrador'], 403);
        }

        $prize = Premio::find($id);

        if (!$prize) {
            return response()->json(['message' => 'Premio no encontrado'], 404);
        }

        // Delete image if exists
        if ($prize->image && file_exists(public_path($prize->image))) {
            unlink(public_path($prize->image));
        }

        $prize->delete();

        return response()->json(['message' => 'Premio eliminado correctamente']);
    }
}