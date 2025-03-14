<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoPromocion extends Model
{
    protected $table = 'tipus_promocio';
    public $timestamps = false;
    
    protected $fillable = [
        'titol',
        'descripcio'
    ];
    
    // Relación con promociones
    public function promociones()
    {
        return $this->hasMany(Promocion::class, 'tipus_promocio');
    }
}