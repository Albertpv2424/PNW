<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SupportFormMail extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    /**
     * Create a new message instance.
     */
    public function __construct($data)
    {
        $this->data = $data;
        Log::info('SupportFormMail constructor called', [
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
        Log::info('Building support form email');
        
        return $this->subject('Nueva solicitud de soporte: ' . ($this->data['issueType'] ?? 'Consulta'))
                    ->replyTo($this->data['email'], $this->data['name'])
                    ->view('emails.support-form')
                    ->with([
                        'name' => $this->data['name'] ?? '',
                        'email' => $this->data['email'] ?? '',
                        'issueType' => $this->data['issueType'] ?? '',
                        'priority' => $this->data['priority'] ?? 'Media',
                        'messageContent' => $this->data['message'] ?? ''
                    ]);
    }
}