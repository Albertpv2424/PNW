import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service'; // Add this import

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats = {
    totalUsers: 0,
    totalBets: 0,
    redeemedPrizes: 0,
    totalBalance: 0
  };

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService // Add this injection
  ) { }

  ngOnInit(): void {
    // Check if user is admin before loading stats
    if (!this.authService.isAdmin()) {
      console.error('User is not admin, redirecting to home');
      this.notificationService.showError('No tienes permisos de administrador para acceder a esta sección.');
      this.router.navigate(['/']);
      return;
    }

    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    // Call the admin service to get dashboard stats
    this.adminService.getStats().subscribe({
      next: (data: any) => {
        console.log('Dashboard stats loaded successfully:', data);
        this.stats.totalUsers = data.total_users || 0;
        this.stats.totalBets = data.total_bets || 0;
        this.stats.redeemedPrizes = data.total_prizes_redeemed || 0;
        this.stats.totalBalance = data.total_balance || 0;

        // If you have recent activity in your response
        if (data.recent_activity) {
          // Process recent activity
          console.log('Recent activity:', data.recent_activity);
        }
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);

        if (error.status === 403) {
          this.notificationService.showError('No tienes permisos de administrador para acceder a esta sección.');
          // Redirect to home page
          this.router.navigate(['/']);
        } else if (error.status === 401) {
          this.notificationService.showError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          this.notificationService.showError('Error al cargar las estadísticas: ' + (error.error?.message || 'Error desconocido'));
        }
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
