<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log; // Add this import
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Maneja la subida de imágenes de perfil
     *
     * @param Request $request
     * @return string|null Ruta de la imagen guardada o null si hay error
     */
    private function handleProfileImage(Request $request)
    {
        try {
            if (!$request->hasFile('profile_image')) {
                return null;
            }

            $image = $request->file('profile_image');

            // Validar que es una imagen válida
            if (!$image->isValid()) {
                return null;
            }

            // Crear un nombre único para la imagen
            $fileName = 'profile_' . time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();

            // Definir la ruta donde se guardará la imagen
            $path = 'uploads/profiles';

            // Asegurarse de que el directorio existe
            if (!file_exists(public_path($path))) {
                mkdir(public_path($path), 0755, true);
            }

            // Mover la imagen al directorio de destino
            $image->move(public_path($path), $fileName);

            // Devolver la ruta relativa para guardar en la base de datos
            return $path . '/' . $fileName;
        } catch (\Exception $e) {
            Log::error('Error al procesar la imagen de perfil: ' . $e->getMessage()); // Remove the backslash
            return null;
        }
    }

    // Update the register method to handle the profile image
    public function register(Request $request)
    {
        try {
            $request->validate([
                'nick' => 'required|string|max:255|unique:usuaris,nick',
                'email' => 'required|string|email|max:255|unique:usuaris,email',
                'pswd' => 'required|string|min:8',
                'dni' => 'required|string|size:9|unique:usuaris,dni',
                'telefon' => 'nullable|string|max:15|unique:usuaris,telefon',
                'data_naixement' => 'required|date',
                'profile_image' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            // Process the profile image
            $profileImagePath = $this->handleProfileImage($request);

            $user = new User([
                'nick' => $request->nick,
                'email' => $request->email,
                'pswd' => Hash::make($request->pswd),
                'dni' => $request->dni,
                'telefon' => $request->telefon,
                'data_naixement' => $request->data_naixement,
                'profile_image' => $profileImagePath, // Add the profile image path
                'tipus_acc' => 'Usuari',
                'saldo' => 0,
                'temps_diari' => 3600,
                'bloquejat' => false,
                'apostes_realitzades' => 0,
            ]);

            $user->save();

            return response()->json([
                'message' => 'Usuario registrado correctamente',
                'user' => $user
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al registrar el usuario: ' . $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string', // Changed from 'required|email'
            'password' => 'required',
        ]);

        // Check if input is an email or a nick
        $field = filter_var($request->email, FILTER_VALIDATE_EMAIL) ? 'email' : 'nick';

        $user = User::where($field, $request->email)->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        // Rest of the login method remains the same
        // Try to verify with Bcrypt first
        $passwordValid = false;

        try {
            $passwordValid = Hash::check($request->password, $user->pswd);
        } catch (\Exception $e) {
            // If Bcrypt check fails, try direct comparison (for plain text passwords)
            $passwordValid = ($request->password === $user->pswd);

            // If password is valid, update it to use Bcrypt
            if ($passwordValid) {
                $user->pswd = Hash::make($request->password);
                $user->save();
            }
        }

        if (!$passwordValid) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        // Create a token that will be recognized by Laravel Sanctum
        // This is more secure than just using md5
        $token = $user->createToken('auth-token')->plainTextToken;

        // Return the user and token
        return response()->json([
            'message' => 'Login exitoso',
            'user' => $user,
            'token' => $token
        ]);
    }

    public function resetPassword(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required|min:6',
            ]);

            // Si password es 'verification_only', solo verificamos si el email existe
            if ($request->password === 'verification_only') {
                $user = User::where('email', $request->email)->first();

                if (!$user) {
                    return response()->json([
                        'message' => 'No se encontró ningún usuario con este correo electrónico.'
                    ], 404);
                }

                return response()->json([
                    'message' => 'Email verificado con éxito.'
                ]);
            }

            // Find the user by email
            $user = User::where('email', $request->email)->first();

            if (!$user) {
                return response()->json([
                    'message' => 'No se encontró ningún usuario con este correo electrónico.'
                ], 404);
            }

            // Update the password
            $user->pswd = Hash::make($request->password);
            $user->save();

            return response()->json([
                'message' => 'Contraseña actualizada con éxito.'
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al restablecer la contraseña: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateProfile(Request $request)
    {
        try {
            $request->validate([
                'nick' => 'required|string|max:255',
                'email' => 'required|string|email|max:255',
                'telefon' => 'nullable|string|max:15',
                'current_password' => 'nullable|string',
                'new_password' => 'nullable|string|min:8',
                'profile_image' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            // Obtener el usuario por email
            $user = User::where('email', $request->email)->first();

            if (!$user) {
                return response()->json([
                    'message' => 'Usuario no encontrado'
                ], 404);
            }

            // Verificar si el nick ya está en uso por otro usuario
            // Cambiar 'id' por 'nick' en la condición where
            $existingUser = User::where('nick', $request->nick)
                ->where('nick', '!=', $user->nick)
                ->first();

            if ($existingUser) {
                return response()->json([
                    'message' => 'El nombre de usuario ya está en uso'
                ], 422);
            }

            // Verificar si el email ya está en uso por otro usuario
            // Cambiar 'id' por 'nick' en la condición where
            $existingUser = User::where('email', $request->email)
                ->where('nick', '!=', $user->nick)
                ->first();

            if ($existingUser) {
                return response()->json([
                    'message' => 'El correo electrónico ya está en uso'
                ], 422);
            }

            // Verificar si el teléfono ya está en uso por otro usuario (si se proporciona)
            if ($request->telefon) {
                // Cambiar 'id' por 'nick' en la condición where
                $existingUser = User::where('telefon', $request->telefon)
                    ->where('nick', '!=', $user->nick)
                    ->first();

                if ($existingUser) {
                    return response()->json([
                        'message' => 'El número de teléfono ya está en uso'
                    ], 422);
                }
            }

            // Verificar contraseña actual si se está cambiando la contraseña
            if ($request->current_password && $request->new_password) {
                $passwordValid = false;

                try {
                    $passwordValid = Hash::check($request->current_password, $user->pswd);
                } catch (\Exception $e) {
                    // Si falla la verificación con Bcrypt, intentar comparación directa
                    $passwordValid = ($request->current_password === $user->pswd);
                }

                if (!$passwordValid) {
                    return response()->json([
                        'message' => 'La contraseña actual es incorrecta'
                    ], 422);
                }

                // Actualizar la contraseña
                $user->pswd = Hash::make($request->new_password);
            }

            // Procesar la imagen de perfil si se proporciona
            if ($request->hasFile('profile_image')) {
                $profileImagePath = $this->handleProfileImage($request);
                if ($profileImagePath) {
                    // Eliminar la imagen anterior si existe
                    if ($user->profile_image && file_exists(public_path($user->profile_image))) {
                        unlink(public_path($user->profile_image));
                    }
                    $user->profile_image = $profileImagePath;
                }
            }

            // Actualizar los datos del usuario
            $user->nick = $request->nick;
            $user->email = $request->email;
            $user->telefon = $request->telefon;
            $user->save();

            return response()->json([
                'message' => 'Perfil actualizado correctamente',
                'user' => $user
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar el perfil: ' . $e->getMessage()
            ], 500);
        }
    }
}
