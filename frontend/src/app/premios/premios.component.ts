import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { CombinedBetComponent } from '../combined-bet/combined-bet.component';

@Component({
  selector: 'app-premios',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    CombinedBetComponent
  ],
  templateUrl: './premios.component.html',
  styleUrls: ['./premios.component.css']
})
export class PremiosComponent {
  premios = [
    {
      id: 1,
      name: 'Tour Per Lleida',
      image: 'assets/premios/tour.png',
      points: 1500,
      buttonText: 'CANJEAR'
    },
    {
      id: 2,
      name: 'Karting Alpicat',
      image: 'assets/premios/karting.png',
      points: 2000,
      buttonText: 'CANJEAR'
    },
    {
      id: 3,
      name: 'Partit del Lleida Esportiu',
      image: 'assets/premios/camp_esports.png',
      points: 1000,
      buttonText: 'CANJEAR'
    },
    {
      id: 4,
      name: 'Partit del Hoops Lleida',
      image: 'assets/premios/hipos_lleida.png',
      points: 1000,
      buttonText: 'CANJEAR'
    },
    {
      id: 5,
      name: 'Escape Room Lleida',
      image: 'assets/premios/escape_room.png',
      points: 2500,
      buttonText: 'CANJEAR'
    },
    {
      id: 6,
      name: 'Visita Guiada Museu de Lleida',
      image: 'assets/premios/museu.png',
      points: 800,
      buttonText: 'CANJEAR'
    },
    // Nuevos premios relacionados con Cataluña, cultura y deportes
    {
      id: 7,
      name: 'Entrada Camp Nou Experience',
      image: 'assets/premios/camp_nou.png',
      points: 3000,
      buttonText: 'CANJEAR'
    },
    {
      id: 8,
      name: 'Visita a la Sagrada Familia',
      image: 'assets/premios/sagrada_familia.png',
      points: 2800,
      buttonText: 'CANJEAR'
    },
    {
      id: 9,
      name: 'Tour por Montserrat',
      image: 'assets/premios/montserrat.png',
      points: 3500,
      buttonText: 'CANJEAR'
    },
    {
      id: 10,
      name: 'Entrada Partido RCD Espanyol',
      image: 'assets/premios/espanyol.png',
      points: 1800,
      buttonText: 'CANJEAR'
    },
    {
      id: 11,
      name: 'Visita Museo Dalí en Figueres',
      image: 'assets/premios/dali.png',
      points: 2200,
      buttonText: 'CANJEAR'
    },
    {
      id: 12,
      name: 'Entrada Palau de la Música Catalana',
      image: 'assets/premios/palau.png',
      points: 2500,
      buttonText: 'CANJEAR'
    },
    {
      id: 13,
      name: 'Experiencia Castellers de Tarragona',
      image: 'assets/premios/castellers.png',
      points: 1500,
      buttonText: 'CANJEAR'
    },
    {
      id: 14,
      name: 'Entrada Partido Girona FC',
      image: 'assets/premios/girona.png',
      points: 1200,
      buttonText: 'CANJEAR'
    },
    {
      id: 15,
      name: 'Tour Bodegas del Penedès',
      image: 'assets/premios/bodega.png',
      points: 2000,
      buttonText: 'CANJEAR'
    },
    {
      id: 16,
      name: 'Entrada Gran Teatre del Liceu',
      image: 'assets/premios/teatre.png',
      points: 3000,
      buttonText: 'CANJEAR'
    }
  ];
  
  // Copia de los premios originales para el filtrado
  premiosFiltrados = [...this.premios];
  
  // Estado de ordenación actual
  ordenAscendente = true;

  ordenarPorPuntos() {
    this.ordenAscendente = !this.ordenAscendente;
    
    if (this.ordenAscendente) {
      // Ordenar de menos a más puntos
      this.premiosFiltrados.sort((a, b) => a.points - b.points);
    } else {
      // Ordenar de más a menos puntos
      this.premiosFiltrados.sort((a, b) => b.points - a.points);
    }
  }

  onCanjear(premioId: number) {
    console.log(`Canjeando premio ${premioId}`);
  }
}
