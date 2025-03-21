import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BetService } from '../services/bet.service';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router';
import { ProfileHeaderComponent } from '../profile-header/profile-header.component';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-bets',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule, ProfileHeaderComponent],
  templateUrl: './bets.component.html',
  styleUrls: ['./bets.component.css']
})
export class BetsComponent implements OnInit {
  activeBets: any[] = [];
  isLoading = true;
  error = '';

  // Propiedades para el header del perfil
  username: string = '';
  email: string = '';
  profileImage: string | null = null;
  saldo: number = 0;

  constructor(
    private betService: BetService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadUserBets();
    this.loadUserInfo();
  }

  loadUserBets(): void {
    this.isLoading = true;

    // Load active bets
    this.betService.getUserActiveBets().subscribe({
      next: (data) => {
        this.activeBets = data;
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

  loadUserInfo(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.username = user.nick;
      this.email = user.email;
      this.profileImage = user.profile_image || null;
      this.saldo = user.saldo;
    }
  }
}
