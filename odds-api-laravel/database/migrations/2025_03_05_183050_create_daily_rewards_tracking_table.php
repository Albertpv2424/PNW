<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
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
            $table->timestamps();

            $table->foreign('usuari_nick')
                  ->references('nick')
                  ->on('usuaris')
                  ->onDelete('cascade');
                  
            // Ensure each user has only one record per day
            $table->unique(['usuari_nick', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_rewards_tracking');
    }
};