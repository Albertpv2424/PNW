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
        'image'
    ];
    
    public function traducciones()
    {
        return $this->hasMany(PromocionTraduccion::class, 'promo_id');
    }
    
    public function tipoPromocion()
    {
        return $this->belongsTo(TipoPromocion::class, 'tipus_promocio');
    }
    
    public function inscripciones()
    {
        return $this->hasMany(InscripcionPromocion::class, 'promo_id');
    }
}