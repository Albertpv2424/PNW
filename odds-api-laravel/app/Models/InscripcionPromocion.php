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
        'data_inscripcio',
        'compleix_requisits'
    ];
    
    protected $primaryKey = null;
    public $incrementing = false;
    
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuari_nick', 'nick');
    }
    
    public function promocion()
    {
        return $this->belongsTo(Promocion::class, 'promo_id');
    }
}