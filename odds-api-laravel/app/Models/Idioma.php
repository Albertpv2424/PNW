<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Idioma extends Model
{
    protected $table = 'idiomas';
    public $timestamps = false;
    
    protected $fillable = [
        'codigo_iso',
        'nombre'
    ];
    
    // Relación con traducciones de premios
    public function premioTraducciones()
    {
        return $this->hasMany(PremioTraduccion::class, 'idioma_id');
    }
    
    // Relación con traducciones de promociones
    public function promocionTraducciones()
    {
        return $this->hasMany(PromocionTraduccion::class, 'idioma_id');
    }
}