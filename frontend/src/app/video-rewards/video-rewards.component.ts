
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { HeaderComponent } from '../header/header.component';
import { environment } from '../../environments/environment';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-video-rewards',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './video-rewards.component.html',
  styleUrls: ['./video-rewards.component.css']
})
export class VideoRewardsComponent implements OnInit, OnDestroy {
  // Video state
  currentVideo: any = null;
  videoUrl: SafeResourceUrl | null = null;
  showVideo: boolean = false;
  videoCompleted: boolean = false;
  progressPercentage: number = 0;
  remainingTime: number = 0;
  pointsEarned: number = 0;

  // Stats
  videosWatchedToday: number = 0;
  pointsEarnedToday: number = 0;
  dailyLimitReached: boolean = false;

  // Video library - estos son ejemplos, puedes usar videos reales
  videoLibrary = [
    { id: 1, embedId: 'dQw4w9WgXcQ', duration: 30 }, // Rick Astley - Never Gonna Give You Up
    { id: 2, embedId: 'jNQXAC9IVRw', duration: 30 }, // Me at the zoo
    { id: 3, embedId: 'kJQP7kiw5Fk', duration: 30 }, // Despacito
    { id: 4, embedId: 'FTQbiNvZqaY', duration: 30 }, // Toto - Africa
    { id: 5, embedId: 'fJ9rUzIMcZQ', duration: 30 }, // Queen - Bohemian Rhapsody
    { id: 6, embedId: 'y6120QOlsfU', duration: 30 }, // Darude - Sandstorm
    { id: 7, embedId: 'L_jWHffIx5E', duration: 30 }, // Smash Mouth - All Star
    { id: 8, embedId: 'djV11Xbc914', duration: 30 }, // a-ha - Take On Me
    { id: 9, embedId: 'btPJPFnesV4', duration: 30 }, // Eye of the Tiger
    { id: 10, embedId: 'YR5ApYxkU-U', duration: 30 } // Pink Floyd - Another Brick In The Wall
  ];

  private timerSubscription: Subscription | null = null;
  private apiUrl = environment.apiUrl;

  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadUserStats();
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  loadUserStats(): void {
    // Verificar si el usuario está autenticado
    if (!this.authService.isLoggedIn()) {
      this.notificationService.showError('Debes iniciar sesión para acceder a esta función');
      return;
    }

    // Cargar estadísticas del usuario desde localStorage o API
    const stats = localStorage.getItem('videoRewardsStats');

    if (stats) {
      const parsedStats = JSON.parse(stats);
      const today = new Date().toDateString();

      // Si las estadísticas son de hoy, cargarlas
      if (parsedStats.date === today) {
        this.videosWatchedToday = parsedStats.videosWatched;
        this.pointsEarnedToday = parsedStats.pointsEarned;
        this.dailyLimitReached = this.videosWatchedToday >= 5;
      } else {
        // Si son de otro día, reiniciar
        this.resetStats();
      }
    } else {
      this.resetStats();
    }
  }

  resetStats(): void {
    this.videosWatchedToday = 0;
    this.pointsEarnedToday = 0;
    this.dailyLimitReached = false;

    const today = new Date().toDateString();
    localStorage.setItem('videoRewardsStats', JSON.stringify({
      date: today,
      videosWatched: 0,
      pointsEarned: 0
    }));
  }

  startWatchingVideos(): void {
    if (this.dailyLimitReached) {
      this.notificationService.showInfo('Has alcanzado el límite diario de videos');
      return;
    }

    this.loadNextVideo();
  }

  loadNextVideo(): void {
    if (this.dailyLimitReached) {
      return;
    }

    // Reiniciar estado
    this.videoCompleted = false;
    this.progressPercentage = 0;

    // Seleccionar video aleatorio
    const randomIndex = Math.floor(Math.random() * this.videoLibrary.length);
    this.currentVideo = this.videoLibrary[randomIndex];

    // Preparar URL segura para el iframe
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${this.currentVideo.embedId}?autoplay=1&controls=0&disablekb=1`
    );

    // Mostrar video después de un breve retraso
    setTimeout(() => {
      this.showVideo = true;
      this.startVideoTimer();
    }, 500);
  }

  startVideoTimer(): void {
    // Configurar temporizador
    this.remainingTime = this.currentVideo.duration;

    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.timerSubscription = interval(1000).subscribe(() => {
      this.remainingTime--;
      this.progressPercentage = ((this.currentVideo.duration - this.remainingTime) / this.currentVideo.duration) * 100;

      if (this.remainingTime <= 0) {
        this.completeVideo();
      }
    });
  }

  completeVideo(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }

    this.showVideo = false;
    this.videoCompleted = true;

    // Generar puntos aleatorios entre 10 y 50
    this.pointsEarned = Math.floor(Math.random() * 41) + 10;

    // Actualizar estadísticas
    this.videosWatchedToday++;
    this.pointsEarnedToday += this.pointsEarned;
    this.dailyLimitReached = this.videosWatchedToday >= 5;

    // Guardar estadísticas
    const today = new Date().toDateString();
    localStorage.setItem('videoRewardsStats', JSON.stringify({
      date: today,
      videosWatched: this.videosWatchedToday,
      pointsEarned: this.pointsEarnedToday
    }));

    // Actualizar saldo del usuario
    this.updateUserBalance(this.pointsEarned);
  }

  updateUserBalance(points: number): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.notificationService.showError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.post(`${this.apiUrl}/add-points`, { points }, { headers }).subscribe({
      next: (response: any) => {
        if (response.success) {
          // Actualizar el usuario en el servicio de autenticación
          const currentUser = this.authService.getCurrentUser();
          if (currentUser) {
            currentUser.saldo = response.saldo;
            this.authService.updateCurrentUser(currentUser);
          }

          this.notificationService.showSuccess(`¡Has ganado ${points} puntos!`);
        }
      },
      error: (error) => {
        console.error('Error al actualizar el saldo:', error);
        this.notificationService.showError('No se pudo actualizar tu saldo. Inténtalo de nuevo más tarde.');
      }
    });
  }
}
