<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\ContactFormMail;

class TestContactController extends Controller
{
    public function testContactForm()
    {
        try {
            Log::info('Intentando enviar correo de prueba de contacto');
            
            $data = [
                'name' => 'Usuario de Prueba',
                'email' => 'predictnwinmail@gmail.com',
                'issueType' => 'Prueba de Contacto',
                'message' => 'Este es un mensaje de prueba del formulario de contacto.',
                'to' => 'predictnwinmail@gmail.com'
            ];
            
            Mail::to($data['to'])
                ->send(new ContactFormMail($data));
            
            Log::info('Correo de prueba de contacto enviado correctamente');
            
            return response()->json(['message' => 'Correo de prueba de contacto enviado correctamente']);
        } catch (\Exception $e) {
            Log::error('Error al enviar correo de prueba de contacto: ' . $e->getMessage());
            Log::error('Trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'message' => 'Error al enviar correo de prueba de contacto',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
}