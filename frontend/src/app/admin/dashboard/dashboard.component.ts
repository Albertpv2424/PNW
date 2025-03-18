import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: any = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Verificar si el usuario está autenticado y es administrador
    this.currentUser = this.authService.getCurrentUser();
    console.log('Dashboard - Current user:', this.currentUser);
    
    if (!this.currentUser) {
      this.notificationService.showError('Acceso no autorizado');
      this.router.navigate(['/login']);
      return;
    }
    
    // Usar la misma comparación flexible que en el AuthGuard
    const isAdmin = this.currentUser.tipus_acc && 
                   ['admin', 'Admin', 'administrador', 'Administrador'].includes(
                     this.currentUser.tipus_acc.toString().trim()
                   );
    
    if (!isAdmin) {
      this.notificationService.showError('No tienes permisos de administrador');
      this.router.navigate(['/']);
      return;
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
