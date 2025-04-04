<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'user_id',
    ];

    // Primary key is not id but session_id
    protected $primaryKey = 'session_id';
    public $incrementing = false;
    protected $keyType = 'string';

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'nick');
    }

    public function messages()
    {
        return $this->hasMany(ChatMessage::class, 'chat_session_id', 'session_id');
    }
}