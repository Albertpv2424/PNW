<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class DailyRewardsTracking extends Model
{
    use HasFactory;

    protected $table = 'daily_rewards_tracking';

    protected $fillable = [
        'usuari_nick', // Changed from 'user_nick' to 'usuari_nick'
        'date',
        'wheel_spun',
        'videos_watched',
        'wheel_points_earned',
        'video_points_earned'
    ];

    /**
     * Get today's record for a user, or create a new one if it doesn't exist
     *
     * @param string $userNick
     * @return DailyRewardsTracking
     */
    public static function getTodayRecord($userNick)
    {
        $today = Carbon::today()->format('Y-m-d');

        $record = self::where('usuari_nick', $userNick) // Changed from 'user_nick' to 'usuari_nick'
                      ->where('date', $today)
                      ->first();

        if (!$record) {
            // Create a new record for today
            $record = self::create([
                'usuari_nick' => $userNick, // Changed from 'user_nick' to 'usuari_nick'
                'date' => $today,
                'wheel_spun' => false,
                'videos_watched' => 0,
                'wheel_points_earned' => 0,
                'video_points_earned' => 0
            ]);
        }

        return $record;
    }
}