<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PremioUsuario extends Model
{
    protected $table = 'premis_usuaris';
    public $timestamps = false;
    
    protected $fillable = [
        'usuari_nick',
        'premi_id',
        'data_reclamat',
        'data_limit',
        'usat'
    ];
    
    // Relación con usuario
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuari_nick', 'nick');
    }
    
    // Relación con premio
    public function premio()
    {
        return $this->belongsTo(Premio::class, 'premi_id');
    }
}