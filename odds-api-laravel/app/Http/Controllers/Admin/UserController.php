<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

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
            'nick' => 'required|string|max:255|unique:usuaris,nick',
            'email' => 'required|string|email|max:255|unique:usuaris,email',
            'password' => 'required|string|min:8',
            'nom' => 'nullable|string|max:255',
            'cognoms' => 'nullable|string|max:255',
            'data_naixement' => 'nullable|date',
            'tipus_acc' => 'nullable|string',
            'dni' => 'nullable|string|max:20',
            'telefon' => 'nullable|string|max:20',
            'saldo' => 'nullable|numeric|min:0',
            'profile_image' => 'nullable|image|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Crear el usuario
        $user = new User();
        $user->nick = $request->nick;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->nom = $request->input('nom', '');
        $user->cognoms = $request->input('cognoms', '');
        $user->data_naix = $request->input('data_naixement');
        $user->tipus_acc = $request->input('tipus_acc', 'Usuari');
        $user->dni = $request->input('dni', '');
        $user->telefon = $request->input('telefon', '');
        $user->saldo = $request->input('saldo', 0);

        // Procesar la imagen de perfil si se proporciona
        if ($request->hasFile('profile_image')) {
            $path = $request->file('profile_image')->store('profile_images', 'public');
            $user->profile_image = $path;
        }

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
            'email' => 'required|string|email|max:255|unique:usuaris,email,' . $user->id,
            'nom' => 'required|string|max:255',
            'cognoms' => 'required|string|max:255',
            'data_naix' => 'required|date',
            'password' => 'nullable|string|min:8',
            'saldo' => 'nullable|numeric|min:0',
            'profile_image' => 'nullable|image|max:2048' // Permitir actualizar imagen de perfil
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

        // Procesar la imagen de perfil si se proporciona
        if ($request->hasFile('profile_image')) {
            // Eliminar la imagen anterior si existe
            if ($user->profile_image) {
                Storage::disk('public')->delete($user->profile_image);
            }

            $path = $request->file('profile_image')->store('profile_images', 'public');
            $user->profile_image = $path;
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
    /**
     * Eliminar un usuario
     */
    public function destroy($id)
    {
        // Verificar si el usuario tiene permisos de administrador
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'No tienes permisos de administrador'], 403);
        }

        // Registrar información de depuración
        Log::info('Intento de eliminar usuario con ID: ' . $id);

        // Buscar el usuario
        $user = User::find($id);

        if (!$user) {
            Log::error('Usuario no encontrado con ID: ' . $id);
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        // No permitir eliminar usuarios administradores
        if (strtolower($user->tipus_acc) === 'administrador' || strtolower($user->tipus_acc) === 'admin') {
            Log::warning('Intento de eliminar un usuario administrador: ' . $user->nick);
            return response()->json(['message' => 'No se pueden eliminar usuarios administradores'], 403);
        }

        try {
            // Eliminar la imagen de perfil si existe
            if ($user->profile_image) {
                Storage::disk('public')->delete($user->profile_image);
            }

            // Eliminar el usuario
            $user->delete();
            Log::info('Usuario eliminado correctamente: ' . $user->nick);

            return response()->json(['message' => 'Usuario eliminado con éxito']);
        } catch (\Exception $e) {
            Log::error('Error al eliminar usuario: ' . $e->getMessage());
            return response()->json(['message' => 'Error al eliminar el usuario: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Actualizar el saldo de un usuario específico
     */
    public function updateBalance(Request $request, $nick)
    {
        // Verificar si el usuario tiene permisos de administrador
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'No tienes permisos de administrador'], 403);
        }

        // Buscar el usuario por nick
        $user = User::where('nick', $nick)->first();

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        // Validar los datos de entrada
        $validator = Validator::make($request->all(), [
            'saldo' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Actualizar el saldo
        $user->saldo = $request->saldo;
        $user->save();

        return response()->json([
            'message' => 'Saldo actualizado correctamente',
            'saldo' => $user->saldo
        ]);
    }

    /**
     * Actualizar la imagen de perfil de un usuario
     */
    public function updateProfileImage(Request $request, $id)
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
            'profile_image' => 'required|image|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Eliminar la imagen anterior si existe
        if ($user->profile_image) {
            Storage::disk('public')->delete($user->profile_image);
        }

        // Guardar la nueva imagen
        $path = $request->file('profile_image')->store('profile_images', 'public');
        $user->profile_image = $path;
        $user->save();

        return response()->json([
            'message' => 'Imagen de perfil actualizada con éxito',
            'user' => $user,
            'profile_image_url' => url('storage/' . $path)
        ]);
    }

    /**
     * Eliminar un usuario y todos sus datos asociados
     */
    public function deleteAllData($id)
    {
        try {
            // Verificar si el usuario tiene permisos de administrador
            if (!$this->isAdmin()) {
                return response()->json(['message' => 'No tienes permisos de administrador'], 403);
            }

            // Buscar el usuario por nick (no por ID ya que la tabla no tiene columna 'id')
            $user = User::where('nick', $id)->first();

            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }

            // No permitir eliminar usuarios administradores
            if (strtolower($user->tipus_acc) === 'administrador' || strtolower($user->tipus_acc) === 'admin') {
                Log::warning('Intento de eliminar un usuario administrador: ' . $user->nick);
                return response()->json(['message' => 'No se pueden eliminar usuarios administradores'], 403);
            }

            // Guardar el nick para el log
            $userNick = $user->nick;

            // Use try-catch blocks for each deletion to handle missing tables
            try {
                // 1. Delete chat messages where the user is involved
                DB::table('chat_messages')
                    ->where('user_id', $userNick)
                    ->orWhere('admin_id', $userNick)
                    ->delete();
            } catch (\Exception $e) {
                Log::warning('Error al eliminar chat_messages: ' . $e->getMessage());
            }

            try {
                // 2. Get all session IDs where the user is involved
                $sessionIds = DB::table('chat_sessions')
                    ->where('user_id', $userNick)
                    ->orWhere('admin_id', $userNick)
                    ->pluck('session_id')
                    ->toArray();

                // 3. Delete all messages from these sessions (even if not directly from the user)
                if (!empty($sessionIds)) {
                    DB::table('chat_messages')
                        ->whereIn('chat_session_id', $sessionIds)
                        ->delete();
                }
            } catch (\Exception $e) {
                Log::warning('Error al obtener o eliminar mensajes de sesiones: ' . $e->getMessage());
            }

            try {
                // 4. Now delete the chat sessions
                DB::table('chat_sessions')
                    ->where('user_id', $userNick)
                    ->orWhere('admin_id', $userNick)
                    ->delete();
            } catch (\Exception $e) {
                Log::warning('Error al eliminar chat_sessions: ' . $e->getMessage());
            }

            // Try to delete from prediccions_sist instead of apuestas
            try {
                DB::table('prediccions_sist')->where('usuari_nick', $userNick)->delete();
            } catch (\Exception $e) {
                Log::warning('Error al eliminar prediccions_sist: ' . $e->getMessage());
            }

            try {
                DB::table('prediccio_proposada')->where('usuari_nick', $userNick)->delete();
            } catch (\Exception $e) {
                Log::warning('Error al eliminar prediccio_proposada: ' . $e->getMessage());
            }

            // Try to delete from inscripcio_a_promos instead of promociones_users
            try {
                DB::table('inscripcio_a_promos')->where('usuari_nick', $userNick)->delete();
            } catch (\Exception $e) {
                Log::warning('Error al eliminar inscripcio_a_promos: ' . $e->getMessage());
            }

            try {
                // Delete user limitations
                DB::table('limitacio')->where('usuari_nick', $userNick)->delete();
            } catch (\Exception $e) {
                Log::warning('Error al eliminar limitacio: ' . $e->getMessage());
            }

            try {
                // Delete daily rewards tracking
                DB::table('daily_rewards_tracking')->where('usuari_nick', $userNick)->delete();
            } catch (\Exception $e) {
                Log::warning('Error al eliminar daily_rewards_tracking: ' . $e->getMessage());
            }

            try {
                // Delete prize redemptions
                DB::table('premis_usuaris')->where('usuari_nick', $userNick)->delete();
            } catch (\Exception $e) {
                Log::warning('Error al eliminar premis_usuaris: ' . $e->getMessage());
            }

            try {
                // Delete user tokens
                DB::table('personal_access_tokens')
                    ->where('tokenable_type', 'App\\Models\\User')
                    ->where('tokenable_id', $userNick)
                    ->delete();
            } catch (\Exception $e) {
                Log::warning('Error al eliminar personal_access_tokens: ' . $e->getMessage());
            }

            // Delete the user
            $user->delete();

            Log::info('Usuario eliminado completamente: ' . $userNick);
            return response()->json(['message' => 'Usuario y todos sus datos eliminados correctamente']);
        } catch (\Exception $e) {
            Log::error('Error al eliminar usuario y sus datos: ' . $e->getMessage());
            return response()->json(['message' => 'Error al eliminar el usuario y sus datos: ' . $e->getMessage()], 500);
        }
    }
}