<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
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
            ]);
    
            $user = new User([
                'nick' => $request->nick,
                'email' => $request->email,
                'pswd' => Hash::make($request->pswd),
                'dni' => $request->dni,
                'telefon' => $request->telefon,
                'data_naixement' => $request->data_naixement,
                'tipus_acc' => 'Usuari',
                'saldo' => 0,
                'temps_diari' => 3600,
                'bloquejat' => false,
                'apostes_realitzades' => 0,
            ]);
    
            $user->save();
    
            return response()->json(['message' => 'Usuario registrado correctamente'], 201);
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

        // Instead of creating a token, just return the user
        return response()->json([
            'message' => 'Login exitoso',
            'user' => $user,
            // Generate a simple session identifier instead of a Sanctum token
            'token' => md5($user->nick . time())
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
}
