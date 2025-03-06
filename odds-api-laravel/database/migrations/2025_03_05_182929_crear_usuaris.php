<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up() {
        Schema::create('usuaris', function (Blueprint $table) {
            $table->string('nick', 50)->primary();
            $table->string('email')->unique();
            $table->enum('tipus_acc', ['Usuari', 'Usuari_premium', 'Administrador']);
            $table->string('pswd');
            $table->decimal('saldo', 10, 2)->default(0);
            $table->timestamp('creat_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->date('actualitzat_el')->nullable();
            $table->integer('apostes_realitzades')->default(0);
            $table->integer('temps_diari')->default(3600); 
            $table->boolean('bloquejat')->default(false);
            $table->string('dni', 9)->unique();
            $table->string('telefon', 15)->nullable();
            $table->date('data_naixement');
        });
    }

    public function down() {
        Schema::dropIfExists('usuaris');
    }
};
