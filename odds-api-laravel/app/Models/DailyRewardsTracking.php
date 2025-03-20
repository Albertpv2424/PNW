<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailyRewardsTracking extends Model
{
    protected $table = 'daily_rewards_tracking';
    
    protected $fillable = [
        'usuari_nick',
        'date',
        'wheel_spun',
        'wheel_points_earned',
        'videos_watched',
        'video_points_earned',
        'bets_today',
        'max_daily_bets',
        'betting_time_today',
        'max_daily_betting_time'
    ];

    protected $casts = [
        'date' => 'date',
        'wheel_spun' => 'boolean',
        'wheel_points_earned' => 'integer',
        'videos_watched' => 'integer',
        'video_points_earned' => 'integer',
        'bets_today' => 'integer',
        'max_daily_bets' => 'integer',
        'betting_time_today' => 'integer',
        'max_daily_betting_time' => 'integer'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'usuari_nick', 'nick');
    }
}