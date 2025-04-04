<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\ContactFormMail;
use App\Mail\SupportFormMail;

class ContactController extends Controller
{
    public function sendContactForm(Request $request)
    {
        // Log the entire request for debugging
        Log::info('Contact form submission received', [
            'request_data' => $request->all()
        ]);

        try {
            // Ensure we have the required fields
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'issueType' => 'required|string|max:255',
                'message' => 'required|string',
            ]);

            // Set the recipient email
            $to = $request->input('to', 'predictnwinmail@gmail.com');
            
            Log::info('Sending contact email to: ' . $to);
            
            // Determine if this is a support form or contact form
            $formType = $request->input('formType', 'contact');
            
            if ($formType === 'support') {
                // Send support form email
                Mail::to($to)->send(new SupportFormMail($request->all()));
                Log::info('Support form email sent successfully');
            } else {
                // Send contact form email
                Mail::to($to)->send(new ContactFormMail($request->all()));
                Log::info('Contact form email sent successfully');
            }
            
            return response()->json(['message' => 'Mensaje enviado con éxito']);
        } catch (\Exception $e) {
            Log::error('Error sending email: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'message' => 'Error al enviar el mensaje: ' . $e->getMessage()
            ], 500);
        }
    }
}