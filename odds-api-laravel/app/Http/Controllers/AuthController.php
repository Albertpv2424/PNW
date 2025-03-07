<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nick' => 'required|unique:usuaris,nick',
            'email' => 'required|email|unique:usuaris,email',
            'pswd' => 'required|min:6',
            'dni' => 'required|unique:usuaris,dni|regex:/^[0-9]{8}[A-Z]$/',
            'telefon' => 'nullable|regex:/^[0-9]{9,15}$/',
            'data_naixement' => 'required|date'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
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
            'apostes_realitzades' => 0
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful',
            'user' => $user,
            'token' => $token
        ], 201);
    }
}
