<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('chat_sessions')) {
            Schema::create('chat_sessions', function (Blueprint $table) {
                $table->id();
                $table->string('session_id')->unique();
                $table->string('user_id');  // nick del usuario
                $table->string('admin_id')->nullable();  // nick del admin asignado
                $table->text('last_message')->nullable();
                $table->timestamp('last_message_time')->nullable();
                $table->boolean('active')->default(true);
                $table->timestamps();

                // Relación con la tabla usuaris
                $table->foreign('user_id')->references('nick')->on('usuaris');
                $table->foreign('admin_id')->references('nick')->on('usuaris');
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('chat_sessions');
    }
};