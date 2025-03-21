<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PremioUsuario extends Model
{
    // Change the table name to match your database
    protected $table = 'premis_usuaris';

    // Disable timestamps
    public $timestamps = false;

    // Define fillable fields
    protected $fillable = [
        'usuari_nick',
        'premi_id',
        'data_reclamat',
        'usat'
    ];

    // Define relationship with Premio model
    public function premio()
    {
        return $this->belongsTo(Premio::class, 'premi_id');
    }

    // Define relationship with User model
    public function user()
    {
        return $this->belongsTo(User::class, 'usuari_nick', 'nick');
    }
}