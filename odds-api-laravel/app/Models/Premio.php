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
        'image'
    ];
    
    // Relación con premios de usuarios
    public function premiosUsuarios()
    {
        return $this->hasMany(PremioUsuario::class, 'premi_id');
    }
    
    // Relación con traducciones
    public function traducciones()
    {
        return $this->hasMany(PremioTraduccion::class, 'premi_id');
    }
    
    // Obtener traducción para un idioma específico
    public function getTraduccion($idiomaId)
    {
        return $this->traducciones()->where('idioma_id', $idiomaId)->first();
    }
}