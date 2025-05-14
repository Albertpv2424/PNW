<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;
use Laravel\Sanctum\Sanctum;

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
    // Add this to your User model if it's not already there
    protected $fillable = [
        'nick',
        'email',
        'pswd', // Note: using pswd instead of password
        'dni',
        'telefon',
        'data_naixement',
        'tipus_acc',
        'saldo',
        'profile_image'
    ];

    // Make sure the password attribute is set to 'pswd'
    protected $hidden = [
        'pswd',
        'remember_token',
    ];

    // Add this method to ensure password hashing works correctly
    public function getAuthPassword()
    {
        return $this->pswd;
    }

    // Add this if you want to use Laravel's password reset functionality
    public function getPasswordAttribute()
    {
        return $this->pswd;
    }

    public function setPasswordAttribute($value)
    {
        $this->attributes['pswd'] = $value;
    }

    /**
     * Boot function to register the creating event
     */
    protected static function boot()
    {
        parent::boot();

        // Configure Sanctum to use a custom PersonalAccessToken model
        Sanctum::usePersonalAccessTokenModel(CustomPersonalAccessToken::class);
    }
}
