<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('prediccions_sist', function (Blueprint $table) {
            $table->id();
            $table->string('usuari_nick', 50)->nullable();
            $table->foreignId('prediccio_proposada_id')->constrained('prediccio_proposada')->cascadeOnDelete();
            $table->foreignId('resultat_prediccio_id')->nullable()->constrained('resultat_prediccio')->nullOnDelete();
            $table->integer('punts_apostats');
            $table->boolean('validat')->default(false);
            $table->foreign('usuari_nick')->references('nick')->on('usuaris')->nullOnDelete();
        });
    }

    public function down() {
        Schema::dropIfExists('prediccions_sist');
    }
};
