import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BettingTimerService } from '../services/betting-timer.service';
import { Subscription } from 'rxjs';
import { BetService } from '../services/bet.service';

@Component({
  selector: 'app-betting-timer',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './betting-timer.component.html',
  styleUrls: ['./betting-timer.component.css']
})
export class BettingTimerComponent implements OnInit, OnDestroy {
  // Propiedades principales
  remainingTime: number = 0;
  maxDailyTime: number = 0;
  formattedTime: string = '00:00:00';
  percentageRemaining: number = 100;
  betsPlaced: number = 0;
  hoursSpent: number = 0;
  minutesSpent: number = 0;

  // Añadir una propiedad para indicar si está en modo header
  @Input() headerMode: boolean = true;

  // Suscripciones
  private timerSubscription: Subscription | null = null;
  private maxTimeSubscription: Subscription | null = null;
  private betsSubscription: Subscription | null = null;

  constructor(
    private bettingTimerService: BettingTimerService,
    private betService: BetService
  ) {}

  ngOnInit(): void {
    // Inicializar el temporizador
    this.bettingTimerService.initTimer();

    // Suscribirse al tiempo restante
    this.timerSubscription = this.bettingTimerService.getRemainingTime().subscribe(time => {
      this.remainingTime = time;
      this.formattedTime = this.formatTime(time);

      // Obtener el tiempo máximo diario para calcular el porcentaje
      this.maxTimeSubscription = this.bettingTimerService.getMaxDailyTime().subscribe(maxTime => {
        this.maxDailyTime = maxTime;

        if (this.maxDailyTime > 0) {
          this.percentageRemaining = (time / this.maxDailyTime) * 100;

          // Calcular el tiempo gastado
          const timeSpent = this.maxDailyTime - time;
          this.hoursSpent = Math.floor(timeSpent / 3600);
          this.minutesSpent = Math.floor((timeSpent % 3600) / 60);
        }
      });
    });

    // Obtener las apuestas realizadas hoy
    this.loadBetsPlacedToday();

    // Actualizar las apuestas cada minuto
    setInterval(() => this.loadBetsPlacedToday(), 60000);
  }

  ngOnDestroy(): void {
    // Limpiar todas las suscripciones
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    if (this.maxTimeSubscription) {
      this.maxTimeSubscription.unsubscribe();
    }
    if (this.betsSubscription) {
      this.betsSubscription.unsubscribe();
    }
  }

  /**
   * Formatea el tiempo en segundos a formato HH:MM:SS
   */
  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Obtiene el color del temporizador según el porcentaje restante
   */
  getTimerColor(): string {
    if (this.percentageRemaining > 50) {
      return '#00b341'; // Verde
    } else if (this.percentageRemaining > 20) {
      return '#ffc107'; // Amarillo/Naranja
    } else {
      return '#e74c3c'; // Rojo
    }
  }

  /**
   * Carga el número de apuestas realizadas hoy
   */
  loadBetsPlacedToday(): void {
    this.betsSubscription = this.betService.getTodayBetsCount().subscribe({
      next: (count) => {
        this.betsPlaced = count;
      },
      error: (error) => {
        console.error('Error loading bets count:', error);
        this.betsPlaced = 0;
      }
    });
  }

  /**
   * Verifica si el temporizador está en estado de advertencia (menos del 20%)
   */
  get isWarning(): boolean {
    return this.percentageRemaining <= 20;
  }
}
