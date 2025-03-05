<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('usuaris', function (Blueprint $table) {
            $table->string('nick', 50)->primary();
            $table->string('email')->unique();
            $table->string('tipus_acc');
            $table->string('pswd');
            $table->decimal('saldo', 10, 2)->default(0);
            $table->date('creat_at');
            $table->date('actualitzat_el')->nullable();
            $table->integer('apostes_realitzades')->default(0);
            $table->integer('temps_diari')->default(0);
            $table->boolean('bloquejat')->default(false);
        });
    }

    public function down() {
        Schema::dropIfExists('usuaris');
    }
};
