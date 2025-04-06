<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    use HasFactory;

    protected $table = 'chat_messages';

    protected $fillable = [
        'user_id',
        'admin_id',
        'message',
        'is_admin',
        'read',
        'chat_session_id'
    ];

    // Disable Laravel's default timestamp expectations if your table doesn't have them
    public $timestamps = true;

    public function session()
    {
        return $this->belongsTo(ChatSession::class, 'chat_session_id', 'session_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'nick');
    }

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id', 'nick');
    }
}