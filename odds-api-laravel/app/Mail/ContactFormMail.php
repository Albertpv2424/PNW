<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ContactFormMail extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    /**
     * Create a new message instance.
     */
    public function __construct($data)
    {
        $this->data = $data;
        Log::info('ContactFormMail constructor called', [
            'name' => $data['name'] ?? 'no name',
            'email' => $data['email'] ?? 'no email',
            'issueType' => $data['issueType'] ?? 'no issue type'
        ]);
    }

    /**
     * Build the message.
     */
    public function build()
    {
        Log::info('Building contact form email');
        
        return $this->subject('Nuevo mensaje de contacto: ' . ($this->data['issueType'] ?? 'Consulta'))
                    ->replyTo($this->data['email'], $this->data['name'])
                    ->view('emails.contact-form')
                    ->with([
                        'name' => $this->data['name'] ?? '',
                        'email' => $this->data['email'] ?? '',
                        'issueType' => $this->data['issueType'] ?? '',
                        'messageContent' => $this->data['message'] ?? ''
                    ]);
    }
}