<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;
    public $timestamps = false;  // Add this line to disable timestamps
    protected $table = 'usuaris';
    
    protected $primaryKey = 'nick';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'nick',
        'email',
        'pswd',
        'dni',
        'telefon',
        'data_naixement',
        'tipus_acc',
        'saldo',
        'temps_diari',
        'bloquejat',
        'apostes_realitzades'
    ];
}
