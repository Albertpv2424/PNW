<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_rewards_tracking', function (Blueprint $table) {
            $table->id();
            $table->string('usuari_nick', 50);
            $table->date('date');
            $table->boolean('wheel_spun')->default(false);
            $table->integer('wheel_points_earned')->default(0);
            $table->integer('videos_watched')->default(0);
            $table->integer('video_points_earned')->default(0);
            $table->integer('bets_today')->default(0);
            $table->integer('max_daily_bets')->default(5);
            $table->integer('betting_time_today')->default(0); 
            $table->integer('max_daily_betting_time')->default(3600);
            $table->timestamp('last_bet_time')->nullable();
            
            $table->timestamps();

            $table->foreign('usuari_nick')
                  ->references('nick')
                  ->on('usuaris')
                  ->onDelete('cascade');
                  
            $table->unique(['usuari_nick', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_rewards_tracking');
    }
};