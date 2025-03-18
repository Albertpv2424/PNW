import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Stats for the dashboard
  stats = {
    totalUsers: 0,
    totalBets: 0,
    redeemedPrizes: 0,
    totalBalance: 0
  };
  
  currentUser: any = null;
  
  constructor(
    private authService: AuthService,
    private adminService: AdminService
  ) {}
  
  ngOnInit(): void {
    // Get the current user
    this.currentUser = this.authService.getCurrentUser();
    
    // Load dashboard data
    this.loadDashboardStats();
  }
  
  loadDashboardStats(): void {
    // Call the admin service to get dashboard stats
    this.adminService.getStats().subscribe({
      next: (data: any) => {
        this.stats.totalUsers = data.total_users || 0;
        this.stats.totalBets = data.total_bets || 0;
        this.stats.redeemedPrizes = data.redeemed_prizes || 0;
        this.stats.totalBalance = data.total_balance || 0;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
      }
    });
  }
  
  // Añadimos el método logout
  logout(): void {
    this.authService.logout();
  }
}
