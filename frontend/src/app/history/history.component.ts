import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BetService } from '../services/bet.service';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  betHistory: any[] = [];
  stats = {
    totalBets: 0,
    wonBets: 0,
    lostBets: 0,
    pendingBets: 0,
    totalWinnings: 0,
    winRate: 0
  };
  isLoading = true;
  error = '';

  constructor(
    private betService: BetService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadBetHistory();
    this.loadBetStats();
  }

  loadBetHistory(): void {
    this.isLoading = true;
    this.error = '';

    this.betService.getUserBetHistory().subscribe({
      next: (data) => {
        this.betHistory = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading bet history:', error);
        this.error = 'Error al cargar el historial de predicciones';
        this.isLoading = false;

        if (error.status === 401) {
          this.notificationService.showError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          this.authService.logout();
        }
      }
    });
  }

  loadBetStats(): void {
    this.betService.getUserBetStats().subscribe({
      next: (data) => {
        this.stats = {
          totalBets: data.totalBets || 0,
          wonBets: data.wonBets || 0,
          lostBets: data.lostBets || 0,
          pendingBets: data.pendingBets || 0,
          totalWinnings: data.totalWinnings || 0,
          winRate: data.winRate || 0
        };
      },
      error: (error) => {
        console.error('Error loading bet statistics:', error);
      }
    });
  }

  // Format date for display
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Get CSS class for bet status
  getStatusClass(status: string): string {
    const statusLower = status.toLowerCase();
    if (statusLower === 'ganada') return 'status-won';
    if (statusLower === 'perdida') return 'status-lost';
    if (statusLower === 'pendiente') return 'status-pending';
    return '';
  }
}
