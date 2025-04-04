<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Verificar si la tabla ya existe antes de intentar crearla
        if (!Schema::hasTable('chat_messages')) {
            Schema::create('chat_messages', function (Blueprint $table) {
                $table->id();
                $table->string('chat_session_id');
                $table->string('user_id');  // Changed from unsignedBigInteger to string
                $table->unsignedBigInteger('admin_id')->nullable();
                $table->text('message');
                $table->boolean('is_admin')->default(false);
                $table->boolean('is_read')->default(false);
                $table->timestamps();
                
                $table->foreign('chat_session_id')->references('session_id')->on('chat_sessions');
                // Remove or comment out the foreign key constraint for user_id if it exists
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('chat_messages');
    }
};