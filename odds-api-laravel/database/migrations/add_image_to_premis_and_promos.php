<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('premis', function (Blueprint $table) {
            $table->string('image')->nullable()->after('condicio');
        });
        
        Schema::table('promos', function (Blueprint $table) {
            $table->string('image')->nullable()->after('tipus_promocio');
        });
    }

    public function down(): void
    {
        Schema::table('premis', function (Blueprint $table) {
            $table->dropColumn('image');
        });
        
        Schema::table('promos', function (Blueprint $table) {
            $table->dropColumn('image');
        });
    }
};