import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  currentUser: any = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Verificar si el usuario está autenticado y es administrador
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser) {
      this.notificationService.showError('Acceso no autorizado');
      this.router.navigate(['/login']);
      return;
    }
    
    // Use the isAdmin method from AuthService
    if (!this.authService.isAdmin()) {
      this.notificationService.showError('No tienes permisos de administrador');
      this.router.navigate(['/']);
      return;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
