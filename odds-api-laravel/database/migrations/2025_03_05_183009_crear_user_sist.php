<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('user_sist', function (Blueprint $table) {
            $table->id();
            $table->string('nick', 50)->unique();
            $table->string('pswd');
        });
    }

    public function down() {
        Schema::dropIfExists('user_sist');
    }
};
