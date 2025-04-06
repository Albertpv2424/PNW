<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('chat_messages')) {
            Schema::create('chat_messages', function (Blueprint $table) {
                $table->id();
                $table->string('user_id');  // Usuario que envía el mensaje (nick)
                $table->string('admin_id')->nullable();  // Admin que responde (nick)
                $table->text('message');
                $table->boolean('is_admin')->default(false);  // Si el mensaje es del admin
                $table->boolean('read')->default(false);
                $table->string('chat_session_id');
                $table->timestamps();

                // Relaciones con la tabla usuaris
                $table->foreign('user_id')->references('nick')->on('usuaris');
                $table->foreign('admin_id')->references('nick')->on('usuaris')->nullable();
                $table->foreign('chat_session_id')->references('session_id')->on('chat_sessions');
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('chat_messages');
    }
};