<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('resultat_prediccio', function (Blueprint $table) {
            $table->id();
            $table->enum('resultat_prediccio', ['Guanyat', 'Perdut', 'Empat'])->nullable();
            $table->string('validacio');
        });
    }

    public function down() {
        Schema::dropIfExists('resultat_prediccio');
    }
};
