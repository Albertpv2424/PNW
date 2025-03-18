<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Apuesta extends Model
{
    use HasFactory;

    // Define the table name if it's not the plural of the model name
    protected $table = 'apuestas';

    // Define fillable fields
    protected $fillable = [
        'usuari_nick',
        'quantitat',
        'cuota',
        'data_aposta',
        'estado',
        'tipo_apuesta',
        'detalles'
    ];

    // Define date fields
    protected $dates = [
        'data_aposta'
    ];

    // Define the relationship with User
    public function user()
    {
        return $this->belongsTo(User::class, 'usuari_nick', 'nick');
    }
}
