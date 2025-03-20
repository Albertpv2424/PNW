<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('daily_rewards_tracking', function (Blueprint $table) {
            $table->integer('bets_today')->default(0)->after('video_points_earned');
            $table->integer('max_daily_bets')->default(5)->after('bets_today');
            $table->integer('betting_time_today')->default(0)->after('max_daily_bets');
            $table->integer('max_daily_betting_time')->default(3600)->after('betting_time_today');
        });
    }

    public function down(): void
    {
        Schema::table('daily_rewards_tracking', function (Blueprint $table) {
            $table->dropColumn([
                'bets_today',
                'max_daily_bets',
                'betting_time_today',
                'max_daily_betting_time'
            ]);
        });
    }
};