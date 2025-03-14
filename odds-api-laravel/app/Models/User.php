<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // Specify the table name
    protected $table = 'usuaris';
    
    // Specify the primary key
    protected $primaryKey = 'nick';
    
    // Specify that the primary key is not an integer
    public $incrementing = false;
    
    // Specify the primary key type
    protected $keyType = 'string';
    
    // Disable timestamps
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nick',
        'email',
        'pswd',
        'tipus_acc',
        'saldo',
        'dni',
        'telefon',
        'data_naixement',
        'profile_image',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'pswd',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'pswd' => 'hashed',
    ];
    
    // Override the getAuthPassword method to use 'pswd' instead of 'password'
    public function getAuthPassword()
    {
        return $this->pswd;
    }
}
