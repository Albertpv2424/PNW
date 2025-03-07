<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    public $timestamps = false;
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
