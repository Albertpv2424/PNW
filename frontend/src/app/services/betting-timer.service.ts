import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, interval } from 'rxjs';
import { UserLimitationsService } from './user-limitations.service';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BettingTimerService {
  private remainingTimeSubject = new BehaviorSubject<number>(0);
  private maxDailyTimeSubject = new BehaviorSubject<number>(0);
  private timerSubscription: Subscription | null = null;
  private lastUpdateTime: number = 0;
  private isTimerRunning = false;
  private isTimerExpired = false;
  private syncInterval: any = null;

  constructor(
    private userLimitationsService: UserLimitationsService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  // Inicializar el contador de tiempo
  initTimer(): void {
    if (this.authService.isLoggedIn()) {
      this.fetchUserLimitations();
      
      // Configurar sincronización periódica con el servidor
      if (!this.syncInterval) {
        this.syncInterval = setInterval(() => {
          this.syncTimeWithServer();
        }, 60000); // Sincronizar cada minuto
      }
    }
  }

  // Obtener las limitaciones del usuario actual
  private fetchUserLimitations(): void {
    this.userLimitationsService.getCurrentUserLimitations().subscribe({
      next: (data) => {
        const remainingTime = data.remaining_time || 0;
        const maxDailyTime = data.max_daily_betting_time || 3600;
        
        this.remainingTimeSubject.next(remainingTime);
        this.maxDailyTimeSubject.next(maxDailyTime);
        
        // Si el tiempo restante es 0, el usuario ha alcanzado su límite
        if (remainingTime <= 0) {
          this.isTimerExpired = true;
          this.notificationService.showWarning('Has alcanzado tu límite diario de tiempo de apuestas');
          this.redirectToLimitPage();
        } else {
          this.startTimer();
        }
      },
      error: (error) => {
        console.error('Error al obtener limitaciones de usuario:', error);
      }
    });
  }

  // Sincronizar el tiempo con el servidor
  syncTimeWithServer(): void {
    if (!this.authService.isLoggedIn()) return;
    
    // Obtener el tiempo restante actual
    const remainingTime = this.remainingTimeSubject.value;
    
    // Calcular el tiempo consumido (tiempo máximo - tiempo restante)
    const maxTime = this.maxDailyTimeSubject.value;
    const timeSpent = maxTime - remainingTime;
    
    // Enviar actualización al servidor
    this.userLimitationsService.updateUserTimeSpent(timeSpent).subscribe({
      next: (response) => {
        // Actualizar el tiempo restante con el valor del servidor
        if (response && response.remaining_time !== undefined) {
          this.updateRemainingTime(response.remaining_time);
        }
      },
      error: (error) => {
        console.error('Error al sincronizar tiempo con el servidor:', error);
      }
    });
  }

  // Iniciar el contador de tiempo
  private startTimer(): void {
    if (this.isTimerRunning) return;
    
    this.isTimerRunning = true;
    this.lastUpdateTime = Date.now();
    
    this.timerSubscription = interval(1000).subscribe(() => {
      const currentTime = Date.now();
      const elapsedSeconds = Math.floor((currentTime - this.lastUpdateTime) / 1000);
      this.lastUpdateTime = currentTime;
      
      const currentValue = this.remainingTimeSubject.value;
      const newValue = Math.max(0, currentValue - elapsedSeconds);
      
      this.remainingTimeSubject.next(newValue);
      
      // Si el tiempo llega a 0, detener el contador y notificar
      if (newValue === 0 && !this.isTimerExpired) {
        this.isTimerExpired = true;
        this.stopTimer();
        this.notificationService.showWarning('Has alcanzado tu límite diario de tiempo de apuestas');
        this.redirectToLimitPage();
      }
    });
  }

  // Detener el contador de tiempo
  stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
    this.isTimerRunning = false;
  }

  // Actualizar el tiempo restante (por ejemplo, después de realizar una apuesta)
  updateRemainingTime(remainingTime: number): void {
    this.remainingTimeSubject.next(remainingTime);
    
    if (remainingTime <= 0 && !this.isTimerExpired) {
      this.isTimerExpired = true;
      this.stopTimer();
      this.notificationService.showWarning('Has alcanzado tu límite diario de tiempo de apuestas');
      this.redirectToLimitPage();
    } else if (remainingTime > 0 && this.isTimerExpired) {
      this.isTimerExpired = false;
      this.startTimer();
    }
  }

  // Redirigir al usuario a una página de límite alcanzado
  private redirectToLimitPage(): void {
    // Cerrar la sesión del usuario
    this.notificationService.showWarning('Has alcanzado tu límite diario de tiempo de apuestas. Se cerrará tu sesión.');
    this.authService.logout();
  }

  // Obtener el tiempo restante como Observable
  getRemainingTime(): Observable<number> {
    return this.remainingTimeSubject.asObservable();
  }

  // Obtener el tiempo máximo diario como Observable
  getMaxDailyTime(): Observable<number> {
    return this.maxDailyTimeSubject.asObservable();
  }

  // Formatear el tiempo en formato legible (HH:MM:SS)
  formatTime(seconds: number): string {
    if (seconds <= 0) return '00:00:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(secs)}`;
  }

  // Añadir ceros a la izquierda para formato de tiempo
  private padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  // Verificar si el usuario ha alcanzado su límite de tiempo
  hasReachedTimeLimit(): boolean {
    return this.isTimerExpired;
  }
  
  // Limpiar recursos al destruir el servicio
  cleanup(): void {
    this.stopTimer();
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Método para iniciar sincronización periódica
  startPeriodicSync(intervalSeconds: number = 60): Subscription {
    return interval(intervalSeconds * 1000).subscribe(() => {
      if (this.authService.isLoggedIn() && !this.isTimerExpired) {
        this.syncTimeWithServer();
      }
    });
  }
}