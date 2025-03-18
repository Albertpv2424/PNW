<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('detalle_prediccio', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prediccio_proposada_id')->constrained('prediccio_proposada')->cascadeOnDelete();
            $table->string('match_id');
            $table->string('equipo');
            $table->string('tipo_apuesta');
            $table->decimal('cuota', 10, 2);
            $table->string('match_info');
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('detalle_prediccio');
    }
};