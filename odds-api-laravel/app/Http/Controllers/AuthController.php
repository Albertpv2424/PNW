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
        $request->validate([
            'nick' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:usuaris,email',
            'pswd' => 'required|string|min:8',
            'dni' => 'required|string|size:9|unique:usuaris,dni',
            'telefon' => 'nullable|string|max:15',
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

        return response()->json(['message' => 'User registered successfully'], 201);
    }
}
