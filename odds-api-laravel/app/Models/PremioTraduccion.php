<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PremioTraduccion extends Model
{
    protected $table = 'premis_traduccions';
    public $timestamps = false;
    
    protected $fillable = [
        'premi_id',
        'idioma_id',
        'titol',
        'descripcio'
    ];
    
    // Relación con el premio
    public function premio()
    {
        return $this->belongsTo(Premio::class, 'premi_id');
    }
    
    // Relación con el idioma
    public function idioma()
    {
        return $this->belongsTo(Idioma::class, 'idioma_id');
    }
}