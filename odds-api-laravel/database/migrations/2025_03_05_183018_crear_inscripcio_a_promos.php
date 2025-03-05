<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('inscripcio_a_promos', function (Blueprint $table) {
            $table->string('usuari_nick', 50);
            $table->foreignId('promo_id')->constrained('promos')->cascadeOnDelete();
            $table->boolean('compleix_requisits')->default(false);
            $table->primary(['usuari_nick', 'promo_id']);
            $table->foreign('usuari_nick')->references('nick')->on('usuaris')->cascadeOnDelete();
        });
    }

    public function down() {
        Schema::dropIfExists('inscripcio_a_promos');
    }
};
