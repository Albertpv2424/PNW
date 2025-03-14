<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Premio extends Model
{
    protected $table = 'premis';
    public $timestamps = false;
    
    protected $fillable = [
        'titol',
        'descripcio',
        'cost',
        'condicio',
        'image' // Añadiremos este campo a la migración
    ];
    
    // Relación con premios de usuarios
    public function premiosUsuarios()
    {
        return $this->hasMany(PremioUsuario::class, 'premi_id');
    }
}