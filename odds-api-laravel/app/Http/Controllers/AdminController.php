<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    /**
     * Constructor para aplicar middleware de autenticación
     */
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Obtener todos los usuarios (excluyendo administradores)
     */
    public function getUsers()
    {
        // Verificar si el usuario tiene permisos de administrador
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'No tienes permisos de administrador'], 403);
        }

        // Use case-insensitive comparison to filter out admin users
        $users = User::whereRaw('LOWER(tipus_acc) != ?', ['admin'])->get();
        return response()->json($users);
    }

    /**
     * Obtener un usuario específico
     */
    public function getUser($id)
    {
        // Verificar si el usuario tiene permisos de administrador
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'No tienes permisos de administrador'], 403);
        }

        $user = User::find($id);
        
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }
        
        return response()->json($user);
    }

    /**
     * Crear un nuevo usuario
     */
    public function createUser(Request $request)
    {
        // Verificar si el usuario tiene permisos de administrador
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'No tienes permisos de administrador'], 403);
        }

        $validator = Validator::make($request->all(), [
            'nick' => 'required|string|unique:users,nick',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'tipus_acc' => 'required|string|in:Usuario,Admin',
            'dni' => 'required|string|unique:users,dni',
            'data_naixement' => 'required|date',
            'saldo' => 'required|numeric|min:0'
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $user = new User();
        $user->nick = $request->nick;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->tipus_acc = $request->tipus_acc;
        $user->dni = $request->dni;
        $user->telefon = $request->telefon;
        $user->data_naixement = $request->data_naixement;
        $user->saldo = $request->saldo;
        $user->save();
        
        return response()->json($user, 201);
    }

    /**
     * Actualizar un usuario existente
     */
    public function updateUser(Request $request, $id)
    {
        // Verificar si el usuario tiene permisos de administrador
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'No tienes permisos de administrador'], 403);
        }

        $user = User::find($id);
        
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }
        
        $validator = Validator::make($request->all(), [
            'nick' => 'required|string|unique:users,nick,' . $id,
            'email' => 'required|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:6',
            'tipus_acc' => 'required|string|in:Usuario,Admin',
            'dni' => 'required|string|unique:users,dni,' . $id,
            'data_naixement' => 'required|date',
            'saldo' => 'required|numeric|min:0'
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $user->nick = $request->nick;
        $user->email = $request->email;
        if ($request->has('password') && !empty($request->password)) {
            $user->password = Hash::make($request->password);
        }
        $user->tipus_acc = $request->tipus_acc;
        $user->dni = $request->dni;
        $user->telefon = $request->telefon;
        $user->data_naixement = $request->data_naixement;
        $user->saldo = $request->saldo;
        $user->save();
        
        return response()->json($user);
    }

    /**
     * Eliminar un usuario
     */
    public function deleteUser($id)
    {
        // Verificar si el usuario tiene permisos de administrador
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'No tienes permisos de administrador'], 403);
        }

        $user = User::find($id);
        
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }
        
        $user->delete();
        
        return response()->json(['message' => 'Usuario eliminado correctamente']);
    }

    /**
     * Actualizar el saldo de un usuario
     */
    public function updateUserBalance(Request $request, $id)
    {
        // Verificar si el usuario tiene permisos de administrador
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'No tienes permisos de administrador'], 403);
        }

        $user = User::find($id);
        
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }
        
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:0'
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $user->saldo = $request->amount;
        $user->save();
        
        return response()->json(['message' => 'Saldo actualizado correctamente', 'saldo' => $user->saldo]);
    }

    /**
     * Cambiar el tipo de cuenta de un usuario
     */
    public function changeUserRole(Request $request, $id)
    {
        // Verificar si el usuario tiene permisos de administrador
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'No tienes permisos de administrador'], 403);
        }

        $user = User::find($id);
        
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }
        
        $validator = Validator::make($request->all(), [
            'role' => 'required|string|in:Usuario,Admin'
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $user->tipus_acc = $request->role;
        $user->save();
        
        return response()->json(['message' => 'Rol actualizado correctamente', 'tipus_acc' => $user->tipus_acc]);
    }

    /**
     * Obtener estadísticas generales
     */
    public function getStats()
    {
        // Verificar si el usuario tiene permisos de administrador
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'No tienes permisos de administrador'], 403);
        }

        $totalUsers = User::count();
        $adminUsers = User::where('tipus_acc', 'Admin')->count();
        $regularUsers = User::where('tipus_acc', 'Usuario')->count();
        $totalBalance = User::sum('saldo');
        
        return response()->json([
            'total_users' => $totalUsers,
            'admin_users' => $adminUsers,
            'regular_users' => $regularUsers,
            'total_balance' => $totalBalance
        ]);
    }

    /**
     * Verificar si el usuario actual es administrador
     */
    private function isAdmin()
    {
        $user = Auth::user();
        return $user && in_array(strtolower($user->tipus_acc), ['admin', 'administrador']);
    }
    // Add these methods to your existing AdminController

/**
 * Get all prizes
 */
public function getPrizes()
{
    // Verify admin permissions
    if (!$this->isAdmin()) {
        return response()->json(['message' => 'No tienes permisos de administrador'], 403);
    }

    // Use Premio model instead of Prize model
    $prizes = \App\Models\Premio::all();
    return response()->json($prizes);
}

/**
 * Get a specific prize
 */
public function getPrize($id)
{
    // Verify admin permissions
    if (!$this->isAdmin()) {
        return response()->json(['message' => 'No tienes permisos de administrador'], 403);
    }

    $prize = \App\Models\Prize::find($id);
    
    if (!$prize) {
        return response()->json(['message' => 'Premio no encontrado'], 404);
    }
    
    return response()->json($prize);
}

/**
 * Create a new prize
 */
public function createPrize(Request $request)
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
    
    $prize = new \App\Models\Prize();
    $prize->titol = $request->titol;
    $prize->descripcio = $request->descripcio;
    $prize->cost = $request->cost;
    $prize->condicio = $request->condicio;
    
    // Handle image upload
    if ($request->hasFile('image')) {
        $image = $request->file('image');
        $imageName = time() . '.' . $image->getClientOriginalExtension();
        $image->move(public_path('uploads/prizes'), $imageName);
        $prize->image = 'uploads/prizes/' . $imageName;
    }
    
    $prize->save();
    
    return response()->json($prize, 201);
}

/**
 * Update an existing prize
 */
public function updatePrize(Request $request, $id)
{
    // Verify admin permissions
    if (!$this->isAdmin()) {
        return response()->json(['message' => 'No tienes permisos de administrador'], 403);
    }

    $prize = \App\Models\Prize::find($id);
    
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
public function deletePrize($id)
{
    // Verify admin permissions
    if (!$this->isAdmin()) {
        return response()->json(['message' => 'No tienes permisos de administrador'], 403);
    }

    $prize = \App\Models\Prize::find($id);
    
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