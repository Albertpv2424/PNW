<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Constructor para aplicar middleware de autenticación
     */
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        // Registrar cada solicitud para depuración
        Log::info('Admin UserController inicializado');
    }

    /**
     * Verificar si el usuario es administrador
     */
    // Add this method to your UserController if it doesn't exist
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

    // Then update your index method to use this check
    public function index()
    {
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
    public function show($id)
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
    public function store(Request $request)
    {
        // Verificar si el usuario tiene permisos de administrador
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'No tienes permisos de administrador'], 403);
        }

        // Validar los datos de entrada
        $validator = Validator::make($request->all(), [
            'nick' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'nom' => 'required|string|max:255',
            'cognoms' => 'required|string|max:255',
            'data_naix' => 'required|date',
            'tipus_acc' => 'required|string|in:Usuario',
            'saldo' => 'nullable|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Crear el usuario
        $user = new User();
        $user->nick = $request->nick;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->nom = $request->nom;
        $user->cognoms = $request->cognoms;
        $user->data_naix = $request->data_naix;
        $user->tipus_acc = $request->tipus_acc;
        $user->saldo = $request->saldo ?? 0;
        $user->save();

        return response()->json([
            'message' => 'Usuario creado con éxito',
            'user' => $user
        ], 201);
    }

    /**
     * Actualizar un usuario existente
     */
    public function update(Request $request, $id)
    {
        // Verificar si el usuario tiene permisos de administrador
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'No tienes permisos de administrador'], 403);
        }

        // Buscar el usuario
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        // Validar los datos de entrada
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'nom' => 'required|string|max:255',
            'cognoms' => 'required|string|max:255',
            'data_naix' => 'required|date',
            'password' => 'nullable|string|min:8',
            'saldo' => 'nullable|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Actualizar el usuario
        $user->email = $request->email;
        $user->nom = $request->nom;
        $user->cognoms = $request->cognoms;
        $user->data_naix = $request->data_naix;

        if ($request->has('password') && !empty($request->password)) {
            $user->password = Hash::make($request->password);
        }

        if ($request->has('saldo')) {
            $user->saldo = $request->saldo;
        }

        $user->save();

        return response()->json([
            'message' => 'Usuario actualizado con éxito',
            'user' => $user
        ]);
    }

    /**
     * Eliminar un usuario
     */
    public function destroy($id)
    {
        // Verificar si el usuario tiene permisos de administrador
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'No tienes permisos de administrador'], 403);
        }

        // Buscar el usuario
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        // No permitir eliminar usuarios administradores
        if (strtolower($user->tipus_acc) === 'admin') {
            return response()->json(['message' => 'No se pueden eliminar usuarios administradores'], 403);
        }

        // Eliminar el usuario
        $user->delete();

        return response()->json(['message' => 'Usuario eliminado con éxito']);
    }

    /**
     * Actualizar el saldo de un usuario
     */
    public function updateBalance(Request $request, $nick)
    {
        // Verificar si el usuario tiene permisos de administrador
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'No tienes permisos de administrador'], 403);
        }

        // Validar los datos de entrada
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Buscar el usuario por nick
        $user = User::where('nick', $nick)->first();

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        // Actualizar el saldo
        $user->saldo += $request->amount;

        // No permitir saldos negativos
        if ($user->saldo < 0) {
            $user->saldo = 0;
        }

        $user->save();

        return response()->json([
            'message' => 'Saldo actualizado con éxito',
            'user' => $user
        ]);
    }

    /**
     * Cambiar el tipo de cuenta de un usuario
     */
    public function changeRole(Request $request, $nick)
    {
        // Verificar si el usuario tiene permisos de administrador
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'No tienes permisos de administrador'], 403);
        }

        // Validar los datos de entrada
        $validator = Validator::make($request->all(), [
            'role' => 'required|string|in:Usuario,Admin'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Buscar el usuario por nick
        $user = User::where('nick', $nick)->first();

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        // Actualizar el tipo de cuenta
        $user->tipus_acc = $request->role;
        $user->save();

        return response()->json([
            'message' => 'Tipo de cuenta actualizado con éxito',
            'user' => $user
        ]);
    }
}