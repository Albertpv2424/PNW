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
  isLoading = true;
  error = '';

  constructor(
    private betService: BetService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadBetHistory();
  }

  loadBetHistory(): void {
    this.isLoading = true;

    // Load bet history
    this.betService.getUserBetHistory().subscribe({
      next: (data) => {
        this.betHistory = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading bet history:', error);
        this.error = 'Error al cargar el historial de apuestas';
        this.isLoading = false;

        if (error.status === 401) {
          this.notificationService.showError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          this.authService.logout();
        }
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

  // Get status class for styling
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'ganada':
        return 'status-won';
      case 'perdida':
        return 'status-lost';
      case 'pendiente':
        return 'status-pending';
      default:
        return '';
    }
  }
}
