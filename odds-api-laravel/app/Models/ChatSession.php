<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatSession extends Model
{
    use HasFactory;

    protected $table = 'chat_sessions';

    protected $fillable = [
        'session_id',
        'user_id',
        'admin_id',
        'last_message',
        'last_message_time',
        'active'
    ];

    public function messages()
    {
        return $this->hasMany(ChatMessage::class, 'chat_session_id', 'session_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'nick');
    }
}