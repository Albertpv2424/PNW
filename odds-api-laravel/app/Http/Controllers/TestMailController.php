<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class TestMailController extends Controller
{
    public function testMail()
    {
        try {
            Log::info('Intentando enviar correo de prueba a predictnwinmail@gmail.com');
            
            Mail::raw('Este es un correo de prueba desde Laravel', function($message) {
                $message->to('predictnwinmail@gmail.com')
                        ->subject('Correo de prueba');
            });
            
            Log::info('Correo de prueba enviado correctamente');
            
            return response()->json(['message' => 'Correo de prueba enviado correctamente']);
        } catch (\Exception $e) {
            Log::error('Error al enviar correo de prueba: ' . $e->getMessage());
            Log::error('Trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'message' => 'Error al enviar correo de prueba',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}