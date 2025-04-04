<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Usuari extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'usuaris';

    protected $fillable = [
        'nick',
        'nom',
        'cognom',
        'email',
        'password',
        'tipus_acc',
        'saldo',
        'data_naix',
        'telefon',
        'dni',
        'actiu'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'actiu' => 'boolean',
    ];

    // Relación con las sesiones de chat
    public function chatSessions()
    {
        return $this->hasMany(ChatSession::class, 'user_id');
    }
}