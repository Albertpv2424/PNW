// Update imports to remove HeaderComponent
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BetService } from '../services/bet.service';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router';
import { ProfileHeaderComponent } from '../profile-header/profile-header.component';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterModule, ProfileHeaderComponent, TranslateModule], // Add TranslateModule
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

  // Propiedades para el header del perfil
  username: string = '';
  email: string = '';
  profileImage: string | null = null;
  saldo: number = 0;

  constructor(
    private betService: BetService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.loadBetHistory();
    this.loadBetStats();
    this.loadUserInfo();
    
    // Establecer el título de la página basado en el idioma actual
    this.translateService.get('HISTORY.TITLE').subscribe((title: string) => {
      this.titleService.setTitle(`PNW - ${title}`);
    });
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
        
        // Usar traducción para el mensaje de error
        this.translateService.get('HISTORY.LOAD_ERROR').subscribe((errorMsg: string) => {
          this.error = errorMsg;
        });
        
        this.isLoading = false;

        if (error.status === 401) {
          this.translateService.get('AUTH.SESSION_EXPIRED').subscribe((errorMsg: string) => {
            this.notificationService.showError(errorMsg);
          });
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
    const currentLang = this.translateService.currentLang;
    
    // Usar el formato de fecha según el idioma
    return date.toLocaleDateString(this.getLocaleForLanguage(currentLang), {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Obtener el locale según el idioma
  private getLocaleForLanguage(lang: string): string {
    switch (lang) {
      case 'es': return 'es-ES';
      case 'en': return 'en-US';
      case 'it': return 'it-IT';
      case 'ca': return 'ca-ES';
      case 'fr': return 'fr-FR';
      case 'de': return 'de-DE';
      case 'zh': return 'zh-CN';
      default: return 'es-ES';
    }
  }

  // Get CSS class for bet status
  getStatusClass(status: string): string {
    const statusLower = status.toLowerCase();
    if (statusLower === 'ganada') return 'status-won';
    if (statusLower === 'perdida') return 'status-lost';
    if (statusLower === 'pendiente') return 'status-pending';
    return '';
  }

  // Método para obtener la traducción del estado de la apuesta
  getTranslatedStatus(status: string): string {
    const statusLower = status.toLowerCase();
    if (statusLower === 'ganada') return 'BETS.WON';
    if (statusLower === 'perdida') return 'BETS.LOST';
    if (statusLower === 'pendiente') return 'BETS.PENDING';
    if (statusLower === 'cancelada') return 'BETS.CANCELED';
    return status;
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
