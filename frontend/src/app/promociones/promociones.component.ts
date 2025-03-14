import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { CombinedBetComponent } from '../combined-bet/combined-bet.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-promociones',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    CombinedBetComponent
  ],
  templateUrl: './promociones.component.html',
  styleUrls: ['./promociones.component.css']
})
export class PromocionesComponent implements OnInit {
  // Promociones diarias
  promocionesDiarias = [
    {
      id: 1,
      name: 'Lunes de Suerte',
      image: 'assets/promociones/lunes.png',
      points: 20,
      description: 'Recibe 20 puntos extra cada lunes al realizar tu primera apuesta',
      buttonText: 'CANJEAR',
      day: 1 // Lunes
    },
    {
      id: 2,
      name: 'Martes de Goles',
      image: 'assets/promociones/martes.png',
      points: 25,
      description: 'Recibe 25 puntos extra cada martes al apostar en partidos de fútbol',
      buttonText: 'CANJEAR',
      day: 2 // Martes
    },
    {
      id: 3,
      name: 'Miércoles de Canastas',
      image: 'assets/promociones/miercoles.png',
      points: 30,
      description: 'Recibe 30 puntos extra cada miércoles al apostar en partidos de baloncesto',
      buttonText: 'CANJEAR',
      day: 3 // Miércoles
    },
    {
      id: 4,
      name: 'Jueves de Combinadas',
      image: 'assets/promociones/jueves.png',
      points: 35,
      description: 'Recibe 35 puntos extra cada jueves al realizar apuestas combinadas',
      buttonText: 'CANJEAR',
      day: 4 // Jueves
    },
    {
      id: 5,
      name: 'Viernes Premium',
      image: 'assets/promociones/viernes.png',
      points: 40,
      description: 'Recibe 40 puntos extra cada viernes en cualquier apuesta',
      buttonText: 'CANJEAR',
      day: 5 // Viernes
    },
    {
      id: 6,
      name: 'Sábado de Campeones',
      image: 'assets/promociones/sabado.png',
      points: 50,
      description: 'Recibe 50 puntos extra cada sábado al apostar en ligas principales',
      buttonText: 'CANJEAR',
      day: 6 // Sábado
    },
    {
      id: 7,
      name: 'Domingo de Descanso',
      image: 'assets/promociones/domingo.png',
      points: 45,
      description: 'Recibe 45 puntos extra cada domingo sin requisitos',
      buttonText: 'CANJEAR',
      day: 0 // Domingo
    }
  ];

  // Promociones mensuales
  promocionesMensuales = [
    {
      id: 8,
      name: 'Bonus Enero',
      image: 'assets/promociones/enero.png',
      points: 100,
      description: 'Recibe 100 puntos extra durante enero al completar 5 apuestas',
      buttonText: 'CANJEAR',
      month: 0 // Enero
    },
    {
      id: 9,
      name: 'Bonus Febrero',
      image: 'assets/promociones/febrero.png',
      points: 120,
      description: 'Recibe 120 puntos extra durante febrero al completar 5 apuestas',
      buttonText: 'CANJEAR',
      month: 1 // Febrero
    },
    {
      id: 10,
      name: 'Bonus Marzo',
      image: 'assets/promociones/marzo.png',
      points: 130,
      description: 'Recibe 130 puntos extra durante marzo al completar 5 apuestas',
      buttonText: 'CANJEAR',
      month: 2 // Marzo
    },
    {
      id: 11,
      name: 'Bonus Abril',
      image: 'assets/promociones/abril.png',
      points: 140,
      description: 'Recibe 140 puntos extra durante abril al completar 5 apuestas',
      buttonText: 'CANJEAR',
      month: 3 // Abril
    },
    {
      id: 12,
      name: 'Bonus Mayo',
      image: 'assets/promociones/mayo.png',
      points: 150,
      description: 'Recibe 150 puntos extra durante mayo al completar 5 apuestas',
      buttonText: 'CANJEAR',
      month: 4 // Mayo
    },
    {
      id: 13,
      name: 'Bonus Junio',
      image: 'assets/promociones/junio.png',
      points: 160,
      description: 'Recibe 160 puntos extra durante junio al completar 5 apuestas',
      buttonText: 'CANJEAR',
      month: 5 // Junio
    },
    {
      id: 14,
      name: 'Bonus Julio',
      image: 'assets/promociones/julio.png',
      points: 170,
      description: 'Recibe 170 puntos extra durante julio al completar 5 apuestas',
      buttonText: 'CANJEAR',
      month: 6 // Julio
    },
    {
      id: 15,
      name: 'Bonus Agosto',
      image: 'assets/promociones/agosto.png',
      points: 180,
      description: 'Recibe 180 puntos extra durante agosto al completar 5 apuestas',
      buttonText: 'CANJEAR',
      month: 7 // Agosto
    },
    {
      id: 16,
      name: 'Bonus Septiembre',
      image: 'assets/promociones/septiembre.png',
      points: 190,
      description: 'Recibe 190 puntos extra durante septiembre al completar 5 apuestas',
      buttonText: 'CANJEAR',
      month: 8 // Septiembre
    },
    {
      id: 17,
      name: 'Bonus Octubre',
      image: 'assets/promociones/octubre.png',
      points: 200,
      description: 'Recibe 200 puntos extra durante octubre al completar 5 apuestas',
      buttonText: 'CANJEAR',
      month: 9 // Octubre
    },
    {
      id: 18,
      name: 'Bonus Noviembre',
      image: 'assets/promociones/noviembre.png',
      points: 220,
      description: 'Recibe 220 puntos extra durante noviembre al completar 5 apuestas',
      buttonText: 'CANJEAR',
      month: 10 // Noviembre
    },
    {
      id: 19,
      name: 'Bonus Diciembre',
      image: 'assets/promociones/diciembre.png',
      points: 250,
      description: 'Recibe 250 puntos extra durante diciembre al completar 5 apuestas',
      buttonText: 'CANJEAR',
      month: 11 // Diciembre
    }
  ];

  // Promociones activas que se mostrarán
  promocionesActivas: any[] = [];
  
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.cargarPromocionesActivas();
  }

  cargarPromocionesActivas() {
    const hoy = new Date();
    const diaSemana = hoy.getDay(); // 0 (domingo) a 6 (sábado)
    const mes = hoy.getMonth(); // 0 (enero) a 11 (diciembre)
    
    // Obtener la promoción del día actual
    const promocionDiaria = this.promocionesDiarias.find(p => p.day === diaSemana);
    
    // Obtener la promoción del mes actual
    const promocionMensual = this.promocionesMensuales.find(p => p.month === mes);
    
    // Combinar promociones activas
    this.promocionesActivas = [];
    if (promocionDiaria) {
      this.promocionesActivas.push(promocionDiaria);
    }
    if (promocionMensual) {
      this.promocionesActivas.push(promocionMensual);
    }
    
    // Añadir algunas promociones permanentes
    this.promocionesActivas.push({
      id: 20,
      name: 'Bienvenida',
      image: 'assets/promociones/bienvenida.png',
      points: 500,
      description: 'Recibe 500 puntos al completar tu registro',
      buttonText: 'CANJEAR'
    });
    
    this.promocionesActivas.push({
      id: 21,
      name: 'Apuesta Combinada',
      image: 'assets/promociones/combinada.png',
      points: 50,
      description: 'Recibe 50 puntos extra por cada apuesta combinada de 3 o más eventos',
      buttonText: 'CANJEAR'
    });
  }

  onCanjear(promoId: number) {
    console.log(`Canjeando promoción ${promoId}`);
    // Aquí implementarías la lógica para canjear la promoción
    // Por ejemplo, verificar si el usuario ya ha canjeado esta promoción
    // y añadir los puntos a su cuenta si es elegible
  }
}
