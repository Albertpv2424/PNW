import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bet-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bet-verification.component.html',
  styleUrls: ['./bet-verification.component.css']
})
export class BetVerificationComponent implements OnInit {
  pendingBets: any[] = [];
  verifiedBets: any[] = [];
  loading: boolean = false;
  activeTab: 'pending' | 'verified' = 'pending';
  selectedBet: any = null;
  verificationComment: string = '';

  constructor(
    private adminService: AdminService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadPendingBets();
  }

  loadPendingBets(): void {
    this.loading = true;
    this.adminService.getPendingBets().subscribe({
      next: (data) => {
        this.pendingBets = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading pending bets:', error);
        this.notificationService.showError('Error al cargar apuestas pendientes');
        this.loading = false;
      }
    });
  }

  loadVerifiedBets(): void {
    this.loading = true;
    this.adminService.getVerifiedBets().subscribe({
      next: (data) => {
        this.verifiedBets = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading verified bets:', error);
        this.notificationService.showError('Error al cargar apuestas verificadas');
        this.loading = false;
      }
    });
  }

  changeTab(tab: 'pending' | 'verified'): void {
    this.activeTab = tab;
    if (tab === 'pending') {
      this.loadPendingBets();
    } else {
      this.loadVerifiedBets();
    }
  }

  selectBet(bet: any): void {
    this.selectedBet = bet;
    this.verificationComment = '';
  }

  closeDetails(): void {
    this.selectedBet = null;
  }

  verifyBet(result: 'ganada' | 'perdida'): void {
    if (!this.selectedBet) return;

    const data = {
      resultado: result,
      comentario: this.verificationComment
    };

    this.adminService.verifyBet(this.selectedBet.id, data).subscribe({
      next: (response) => {
        this.notificationService.showSuccess(`Apuesta marcada como ${result} correctamente`);
        this.closeDetails();
        this.loadPendingBets();
      },
      error: (error) => {
        console.error('Error verifying bet:', error);
        this.notificationService.showError('Error al verificar la apuesta');
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}
