<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PremioUsuario extends Model
{
    protected $table = 'premis_usuaris';
    public $timestamps = false;

    protected $fillable = [
        'usuari_nick',
        'premi_id',
        'data_reclamat',
        // Remove 'data_limit' from fillable since it's a generated column
        'usat'
    ];

    // Add primary key if it's not 'id'
    protected $primaryKey = 'id';

    // If your primary key is not auto-incrementing
    public $incrementing = true;

    // Define relationships
    public function premio()
    {
        return $this->belongsTo(Premio::class, 'premi_id');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuari_nick', 'nick');
    }
}