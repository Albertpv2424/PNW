<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Promocion extends Model
{
    protected $table = 'promos';
    public $timestamps = false;
    
    protected $fillable = [
        'titol',
        'descripcio',
        'data_inici',
        'data_final',
        'tipus_promocio',
        'image' // Añadiremos este campo a la migración
    ];
    
    // Relación con tipo de promoción
    public function tipoPromocion()
    {
        return $this->belongsTo(TipoPromocion::class, 'tipus_promocio');
    }
    
    // Relación con inscripciones
    public function inscripciones()
    {
        return $this->hasMany(InscripcionPromocion::class, 'promo_id');
    }
}