<?php

namespace App\Models;

use Laravel\Sanctum\PersonalAccessToken;

class CustomPersonalAccessToken extends PersonalAccessToken
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'personal_access_tokens';

    /**
     * Get the tokenable model that the access token belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphTo
     */
    public function tokenable()
    {
        return $this->morphTo('tokenable', null, null, 'nick');
    }
}