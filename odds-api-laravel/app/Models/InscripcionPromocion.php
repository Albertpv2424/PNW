<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InscripcionPromocion extends Model
{
    use HasFactory;

    protected $table = 'inscripcio_a_promos';

    protected $fillable = [
        'usuari_nick',
        'promo_id',
        'data_inscripcio',
        'compleix_requisits'
    ];

    public $timestamps = false;

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuari_nick', 'nick');
    }

    public function promocion()
    {
        return $this->belongsTo(Promocion::class, 'promo_id', 'id');
    }
}