<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create apuestas table if it doesn't exist
        if (!Schema::hasTable('apuestas')) {
            Schema::create('apuestas', function (Blueprint $table) {
                $table->id();
                $table->string('user_id', 50);
                $table->foreign('user_id')->references('nick')->on('usuaris')->onDelete('cascade');
                $table->decimal('cantidad', 10, 2);
                $table->string('tipo_apuesta');
                $table->string('estado')->default('pendiente');
                $table->timestamps();
            });
        }

        // Create promociones_users table if it doesn't exist
        if (!Schema::hasTable('promociones_users')) {
            Schema::create('promociones_users', function (Blueprint $table) {
                $table->id();
                $table->string('user_id', 50);
                $table->foreign('user_id')->references('nick')->on('usuaris')->onDelete('cascade');
                $table->unsignedBigInteger('promocion_id');
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Don't drop tables in down method to avoid data loss
    }
};