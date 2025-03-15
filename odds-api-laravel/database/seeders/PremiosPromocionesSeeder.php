<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class PremiosPromocionesSeeder extends Seeder
{
    public function run()
    {
        // Desactivar verificación de claves foráneas
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Limpiar las tablas
        DB::table('premis_usuaris')->truncate();
        DB::table('inscripcio_a_promos')->truncate();
        DB::table('premis')->truncate();
        DB::table('promos')->truncate();
        DB::table('tipus_promocio')->truncate();

        // Reactivar verificación de claves foráneas
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Insertar tipos de promoción
        $tiposPromocion = [
            [
                'titol' => 'Bienvenida',
                'descripcio' => 'Promociones para nuevos usuarios'
            ],
            [
                'titol' => 'Temporada',
                'descripcio' => 'Promociones por temporada deportiva'
            ],
            [
                'titol' => 'Evento Especial',
                'descripcio' => 'Promociones para eventos deportivos especiales'
            ]
        ];

        foreach ($tiposPromocion as $tipo) {
            DB::table('tipus_promocio')->insert($tipo);
        }

        // Insertar premios
        $premios = [
            [
                'titol' => 'Tour Per Lleida',
                'descripcio' => 'Visita guiada por los lugares más emblemáticos de Lleida',
                'cost' => 1500,
                'condicio' => 1,
                'image' => 'uploads/premios/tour.png'  // Asegúrate de que esta ruta sea correcta
            ],
            [
                'titol' => 'Karting Alpicat',
                'descripcio' => 'Sesión de karting en el circuito de Alpicat',
                'cost' => 2000,
                'condicio' => 1,
                'image' => 'uploads/premios/karting.png'
            ],
            [
                'titol' => 'Cena Gourmet',
                'descripcio' => 'Cena para dos personas en un restaurante de alta cocina',
                'cost' => 3000,
                'condicio' => 1,
                'image' => 'uploads/premios/cena.png'
            ],
            [
                'titol' => 'Entradas VIP Lleida Esportiu',
                'descripcio' => 'Dos entradas VIP para un partido del Lleida Esportiu',
                'cost' => 1000,
                'condicio' => 1,
                'image' => 'uploads/premios/camp_esports.png'
            ]
        ];

        foreach ($premios as $premio) {
            DB::table('premis')->insert($premio);
        }

        // Insertar promociones
        $promociones = [
            [
                'titol' => 'Bono de Bienvenida',
                'descripcio' => 'Recibe 500 puntos al registrarte',
                'data_inici' => '2023-01-01',
                'data_final' => '2025-12-31',
                'tipus_promocio' => 1,
                'image' => 'uploads/promociones/bienvenida.png'
            ],
            [
                'titol' => 'Apuesta Segura',
                'descripcio' => 'Recupera tu apuesta si pierdes en tu primera predicción',
                'data_inici' => '2023-06-01',
                'data_final' => '2024-12-31',
                'tipus_promocio' => 1,
                'image' => 'uploads/promociones/apuesta-segura.png'
            ],
            [
                'titol' => 'Copa del Rey 2024',
                'descripcio' => 'Duplica tus puntos en apuestas para la Copa del Rey',
                'data_inici' => '2024-01-01',
                'data_final' => '2024-04-30',
                'tipus_promocio' => 3,
                'image' => 'uploads/promociones/copa-rey.png'
            ],
            [
                'titol' => 'Liga 2023-2024',
                'descripcio' => 'Gana puntos extra por cada 5 predicciones acertadas en La Liga',
                'data_inici' => '2023-08-01',
                'data_final' => '2024-05-31',
                'tipus_promocio' => 2,
                'image' => 'uploads/promociones/liga.png'
            ]
        ];

        foreach ($promociones as $promocion) {
            DB::table('promos')->insert($promocion);
        }
    }
}