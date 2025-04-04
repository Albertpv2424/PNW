<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Verificar si la tabla ya existe antes de intentar crearla
        if (!Schema::hasTable('chat_sessions')) {
            Schema::create('chat_sessions', function (Blueprint $table) {
                $table->id();
                $table->string('session_id')->unique();
                $table->string('user_id');  // Just use string without foreign key for now
                $table->text('last_message')->nullable();
                $table->timestamp('last_message_time')->nullable();
                $table->timestamps();
                
                // Comment out the foreign key constraint temporarily
                // $table->foreign('user_id')->references('nick')->on('usuaris');
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('chat_sessions');
    }
};
