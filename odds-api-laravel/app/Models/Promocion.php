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
        'tipus_promocio', // This should match the column name in the database
        'image'
    ];

    public function tipoPromocion()
    {
        return $this->belongsTo(TipoPromocion::class, 'tipus_promocio');
    }
}