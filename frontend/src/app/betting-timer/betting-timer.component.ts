import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BettingTimerService } from '../services/betting-timer.service';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-betting-timer',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './betting-timer.component.html',
  styleUrls: ['./betting-timer.component.css']
})
export class BettingTimerComponent implements OnInit, OnDestroy {
  remainingTime: number = 0;
  maxDailyTime: number = 0;
  formattedTime: string = '00:00:00';
  percentageRemaining: number = 100;
  private timerSubscription: Subscription | null = null;
  private maxTimeSubscription: Subscription | null = null;
  private syncSubscription: Subscription | null = null;

  constructor(private bettingTimerService: BettingTimerService) { }

  ngOnInit(): void {
    // Inicializar el temporizador
    this.bettingTimerService.initTimer();
    
    // Suscribirse al tiempo restante
    this.timerSubscription = this.bettingTimerService.getRemainingTime().subscribe(time => {
      this.remainingTime = time;
      this.formattedTime = this.bettingTimerService.formatTime(time);
      this.updatePercentage();
    });
    
    // Suscribirse al tiempo máximo diario
    this.maxTimeSubscription = this.bettingTimerService.getMaxDailyTime().subscribe(maxTime => {
      this.maxDailyTime = maxTime;
      this.updatePercentage();
    });
    
    // Sincronizar con el servidor cada 30 segundos para evitar problemas de conteo
    this.syncSubscription = this.bettingTimerService.startPeriodicSync(30);
  }

  ngOnDestroy(): void {
    // Limpiar suscripciones
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    if (this.maxTimeSubscription) {
      this.maxTimeSubscription.unsubscribe();
    }
    if (this.syncSubscription) {
      this.syncSubscription.unsubscribe();
    }
  }

  private updatePercentage(): void {
    if (this.maxDailyTime > 0) {
      this.percentageRemaining = (this.remainingTime / this.maxDailyTime) * 100;
    } else {
      this.percentageRemaining = 100;
    }
  }

  getTimerColor(): string {
    if (this.percentageRemaining > 50) {
      return 'var(--success-color)';
    } else if (this.percentageRemaining > 20) {
      return 'var(--warning-color)';
    } else {
      return 'var(--danger-color)';
    }
  }
}
