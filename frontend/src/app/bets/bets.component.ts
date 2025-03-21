import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BetService } from '../services/bet.service';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-bets',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule],
  templateUrl: './bets.component.html',
  styleUrls: ['./bets.component.css']
})
export class BetsComponent implements OnInit {
  activeBets: any[] = [];
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
    this.loadUserBets();
  }

  loadUserBets(): void {
    this.isLoading = true;

    // Load active bets
    this.betService.getUserActiveBets().subscribe({
      next: (data) => {
        this.activeBets = data;
        this.stats.pendingBets = data.length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading active bets:', error);
        this.error = 'Error al cargar las apuestas activas';
        this.isLoading = false;

        if (error.status === 401) {
          this.notificationService.showError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          this.authService.logout();
        }
      }
    });

    // Load bet statistics
    this.betService.getUserBetStats().subscribe({
      next: (data) => {
        this.stats = {
          totalBets: data.total_bets || 0,
          wonBets: data.won_bets || 0,
          lostBets: data.lost_bets || 0,
          pendingBets: data.pending_bets || 0,
          totalWinnings: data.total_winnings || 0,
          winRate: data.win_rate || 0
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
}
