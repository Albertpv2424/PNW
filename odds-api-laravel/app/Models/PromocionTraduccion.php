<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PromocionTraduccion extends Model
{
    protected $table = 'promos_traduccions';
    public $timestamps = false;
    
    protected $fillable = [
        'promo_id',
        'idioma_id',
        'titol',
        'descripcio'
    ];
    
    public function promocion()
    {
        return $this->belongsTo(Promocion::class, 'promo_id');
    }
    
    public function idioma()
    {
        return $this->belongsTo(Idioma::class, 'idioma_id');
    }
}