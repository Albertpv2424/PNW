<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promocion extends Model
{
    use HasFactory;

    protected $table = 'promos';
    public $timestamps = false; // Add this if your table doesn't have timestamps

    protected $fillable = [
        'titol',
        'descripcio',
        'data_inici',
        'data_final',
        'tipus_promocio', // Change this to match your database column name
        'image'
    ];

    public function tipoPromocion()
    {
        return $this->belongsTo(TipoPromocion::class, 'tipus_promocio'); // Update the foreign key
    }
}