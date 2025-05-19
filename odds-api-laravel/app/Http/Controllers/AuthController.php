<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use App\Mail\PasswordResetMail;

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
            Log::error('Error al procesar la imagen de perfil: ' . $e->getMessage());
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
                'profile_image' => 'nullable|string', // Cambiado de 'nullable|file|mimes:jpeg,png,jpg,gif|max:2048' a 'nullable|string'
            ]);

            // Process the profile image
            $profileImagePath = $request->profile_image; // Ya no necesitamos procesamiento especial

            $user = new User([
                'nick' => $request->nick,
                'email' => $request->email,
                'pswd' => Hash::make($request->pswd),
                'dni' => $request->dni,
                'telefon' => $request->telefon,
                'data_naixement' => $request->data_naixement,
                'profile_image' => $profileImagePath, // Ahora es directamente la URL
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
                'profile_image' => 'nullable|string', // Cambiado de 'nullable|file|mimes:jpeg,png,jpg,gif|max:2048' a 'nullable|string'
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
            // Modificar la parte donde se procesa la imagen de perfil
            if ($request->profile_image) {
            // Ya no necesitamos procesar el archivo, simplemente asignamos la URL
            $user->profile_image = $request->profile_image;
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

    public function requestPasswordReset(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
            ]);

            // Find the user by email
            $user = User::where('email', $request->email)->first();

            if (!$user) {
                return response()->json([
                    'message' => 'No se encontró ningún usuario con este correo electrónico.'
                ], 404);
            }

            // Generate a unique token
            $token = Str::random(60);

            // Store the token in the password_resets table
            DB::table('password_resets')->updateOrInsert(
                ['email' => $user->email],
                [
                    'token' => $token,
                    'created_at' => now()
                ]
            );

            // Generate the reset URL
            $resetUrl = env('FRONTEND_URL', 'http://localhost:4200') . '/reset-password?token=' . $token . '&email=' . $user->email;

            // Log the URL for development purposes
            Log::info('Password reset URL for ' . $user->email . ': ' . $resetUrl);

            // Send the email with better error handling
            try {
                Log::info('Attempting to send password reset email to: ' . $user->email);
                Mail::to($user->email)->send(new PasswordResetMail($resetUrl));
                Log::info('Password reset email sent successfully');

                return response()->json([
                    'message' => 'Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña.',
                    'success' => true
                ]);
            } catch (\Exception $e) {
                Log::error('Failed to send password reset email: ' . $e->getMessage());
                Log::error('Error details: ' . $e->getTraceAsString());

                return response()->json([
                    'message' => 'Error al enviar el correo electrónico: ' . $e->getMessage(),
                    'success' => false
                ], 500);
            }
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al solicitar el restablecimiento de contraseña: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Restablece la contraseña utilizando el token enviado por correo electrónico
     */
    public function resetPasswordWithToken(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required|min:8',
                'token' => 'required'
            ]);

            // Find the token in the password_resets table
            $passwordReset = DB::table('password_resets')
                ->where('email', $request->email)
                ->where('token', $request->token)
                ->first();

            if (!$passwordReset) {
                return response()->json([
                    'message' => 'El enlace de restablecimiento no es válido.'
                ], 401);
            }

            // Check if the token is expired (e.g., 60 minutes)
            if (Carbon::parse($passwordReset->created_at)->addMinutes(60)->isPast()) {
                return response()->json([
                    'message' => 'El enlace de restablecimiento ha expirado.'
                ], 401);
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

            // Delete the token
            DB::table('password_resets')->where('email', $request->email)->delete();

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

    public function deleteAccount(Request $request)
    {
        try {
            // Obtener el usuario autenticado
            $user = auth()->user();
    
            if (!$user) {
                return response()->json([
                    'message' => 'Usuario no autenticado'
                ], 401);
            }
    
            // Guardar el nick para el log
            $userNick = $user->nick;
    
            // Eliminar mensajes de chat relacionados con el usuario
            DB::table('chat_messages')->where('user_id', $userNick)->delete();
    
            // Eliminar sesiones de chat donde el usuario es el propietario o el administrador
            DB::table('chat_sessions')->where('user_id', $userNick)->orWhere('admin_id', $userNick)->delete();
    
            // Eliminar la imagen de perfil si existe
            if ($user->profile_image && file_exists(public_path($user->profile_image))) {
                unlink(public_path($user->profile_image));
            }
    
            // Eliminar el usuario 
            $user->delete();
    
            // Registrar la eliminación en el log
            \Illuminate\Support\Facades\Log::info('Cuenta eliminada', [
                'user_nick' => $userNick
            ]);
    
            return response()->json([
                'message' => 'Cuenta eliminada correctamente'
            ]);
    
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error al eliminar cuenta: ' . $e->getMessage());
    
            return response()->json([
                'message' => 'Error al eliminar la cuenta: ' . $e->getMessage()
            ], 500);
        }
    }

    public function addPoints(Request $request)
    {
        try {
            $request->validate([
                'points' => 'required|integer|min:1|max:100',
            ]);

            $user = auth()->user();
            if (!$user) {
                return response()->json(['message' => 'Usuario no autenticado'], 401);
            }

            // Actualizar el saldo del usuario
            $newSaldo = $user->saldo + $request->points;
            $user->saldo = $newSaldo;
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Puntos añadidos correctamente',
                'saldo' => $newSaldo
            ]);
        } catch (\Exception $e) {
            Log::error('Error al añadir puntos: ' . $e->getMessage());
            return response()->json(['message' => 'Error al procesar la solicitud'], 500);
        }
    }


}