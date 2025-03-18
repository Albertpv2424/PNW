<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoPromocion extends Model
{
    use HasFactory;

    // Add this line to specify the correct table name
    protected $table = 'tipus_promocio';

    // Disable timestamps if your table doesn't have them
    public $timestamps = false;

    protected $fillable = [
        'titol',
        'descripcio'
    ];

    /**
     * Get the promociones for this tipo
     */
    public function promociones()
    {
        return $this->hasMany(Promocion::class);
    }
}