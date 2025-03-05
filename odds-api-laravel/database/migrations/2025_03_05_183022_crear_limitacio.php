<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('limitacio', function (Blueprint $table) {
            $table->string('usuari_nick', 50)->primary();
            $table->integer('apostes_diaries')->default(0);
            $table->integer('temps_diari')->default(0);
            $table->integer('punts_apostats')->default(0);
            $table->integer('apostes_maximes_diaries')->default(5);
            $table->foreign('usuari_nick')->references('nick')->on('usuaris')->cascadeOnDelete();
        });
    }

    public function down() {
        Schema::dropIfExists('limitacio');
    }
};
