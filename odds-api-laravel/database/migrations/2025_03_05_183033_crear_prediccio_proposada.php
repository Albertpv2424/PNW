<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('prediccio_proposada', function (Blueprint $table) {
            $table->id();
            $table->string('usuari_nick', 50);
            $table->decimal('cuota', 10, 2)->check('cuota > 0');
            $table->decimal('punts_proposats', 10, 2)->check('punts_proposats >= 0');
            $table->foreign('usuari_nick')->references('nick')->on('usuaris')->cascadeOnDelete();
        });
    }

    public function down() {
        Schema::dropIfExists('prediccio_proposada');
    }
};
