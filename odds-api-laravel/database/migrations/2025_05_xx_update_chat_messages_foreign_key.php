<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('chat_messages', function (Blueprint $table) {
            // Eliminar la restricción de clave foránea existente
            $table->dropForeign(['user_id']);
            
            // Añadir la nueva restricción con CASCADE en eliminación
            $table->foreign('user_id')
                  ->references('nick')
                  ->on('usuaris')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('chat_messages', function (Blueprint $table) {
            // Revertir a la restricción original
            $table->dropForeign(['user_id']);
            
            // Recrear la restricción original
            $table->foreign('user_id')
                  ->references('nick')
                  ->on('usuaris');
        });
    }
};