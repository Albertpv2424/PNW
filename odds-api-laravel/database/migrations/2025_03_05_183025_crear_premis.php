<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up() {
        Schema::create('premis', function (Blueprint $table) {
            $table->id();
            $table->string('titol');
            $table->string('descripcio')->nullable();
            $table->decimal('cost', 10, 2);
            $table->decimal('condicio', 10, 2);  // Afegim el camp 'condicio'
        });

        // Afegir la restricció CHECK
        DB::statement('ALTER TABLE premis ADD CONSTRAINT chk_condicio CHECK (condicio > 0)');
    }

    public function down() {
        Schema::dropIfExists('premis');
    }
};
