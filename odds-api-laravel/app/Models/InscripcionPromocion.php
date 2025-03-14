<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InscripcionPromocion extends Model
{
    protected $table = 'inscripcio_a_promos';
    public $timestamps = false;
    
    protected $fillable = [
        'usuari_nick',
        'promo_id',
        'compleix_requisits'
    ];
    
    // Relación con usuario
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuari_nick', 'nick');
    }
    
    // Relación con promoción
    public function promocion()
    {
        return $this->belongsTo(Promocion::class, 'promo_id');
    }
}