<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class DailyRewardsTracking extends Model
{
    use HasFactory;

    protected $table = 'daily_rewards_tracking';
    
    protected $fillable = [
        'usuari_nick',
        'date',
        'wheel_spun',
        'wheel_points_earned',
        'videos_watched',
        'video_points_earned'
    ];

    /**
     * Get the user that owns the tracking record.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'usuari_nick', 'nick');
    }
    
    /**
     * Get or create today's tracking record for a user
     */
    public static function getTodayRecord($userNick)
    {
        try {
            $today = now()->format('Y-m-d');
            
            return self::firstOrCreate(
                ['usuari_nick' => $userNick, 'date' => $today],
                [
                    'wheel_spun' => false,
                    'wheel_points_earned' => 0,
                    'videos_watched' => 0,
                    'video_points_earned' => 0
                ]
            );
        } catch (\Exception $e) {
            Log::error('Error in DailyRewardsTracking::getTodayRecord: ' . $e->getMessage(), [
                'user_nick' => $userNick,
                'trace' => $e->getTraceAsString()
            ]);
            
            // Create a default record in case of error
            $record = new self();
            $record->usuari_nick = $userNick;
            $record->date = now()->format('Y-m-d');
            $record->wheel_spun = false;
            $record->wheel_points_earned = 0;
            $record->videos_watched = 0;
            $record->video_points_earned = 0;
            
            return $record;
        }
    }
}