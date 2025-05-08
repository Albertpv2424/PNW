<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Se han eliminado los seeders como solicitaste
        $this->call([
            // Los seeders han sido comentados o eliminados
        ]);
    }
}

class PremiosPromocionesSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // Otros seeders...
            PremiosPromocionesSeeder::class,
        ]);
    }
}
