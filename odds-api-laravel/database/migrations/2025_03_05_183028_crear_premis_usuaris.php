<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('premis_usuaris', function (Blueprint $table) {
            $table->id();
            $table->string('usuari_nick', 50);
            $table->foreignId('premi_id')->constrained('premis')->cascadeOnDelete();
            $table->timestamp('data_reclamat')->useCurrent();
            // Nota: La funcionalitat de columnes generades (STORED) pot variar segons la versió.
            $table->dateTime('data_limit')->storedAs('DATE_ADD(data_reclamat, INTERVAL 1 MONTH)');
            $table->boolean('usat')->default(false);
            $table->foreign('usuari_nick')->references('nick')->on('usuaris')->cascadeOnDelete();
        });
    }

    public function down() {
        Schema::dropIfExists('premis_usuaris');
    }
};
