<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promocion extends Model
{
    use HasFactory;

    protected $table = 'promos';

    protected $fillable = [
        'titol',
        'descripcio',
        'data_inici',
        'data_final',
        'tipo_promocion_id',
        'image'
    ];

    public function tipoPromocion()
    {
        return $this->belongsTo(TipoPromocion::class, 'tipo_promocion_id');
    }
}