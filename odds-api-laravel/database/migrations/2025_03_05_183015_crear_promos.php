<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('promos', function (Blueprint $table) {
            $table->id();
            $table->string('titol');
            $table->string('descripcio')->nullable();
            $table->date('data_inici');
            $table->date('data_final');
            $table->foreignId('tipus_promocio')->nullable()->constrained('tipus_promocio')->nullOnDelete();
        });
        
        // Afegir la restricció CHECK mitjançant una comanda RAW (exemple per MySQL)
        DB::statement('ALTER TABLE promos ADD CONSTRAINT chk_data CHECK (data_final > data_inici)');
        
    }

    public function down() {
        Schema::dropIfExists('promos');
    }
};
