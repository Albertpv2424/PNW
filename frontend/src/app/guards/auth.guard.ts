import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      this.notificationService.showError('Debes iniciar sesión para acceder a esta página');
      this.router.navigate(['/login']);
      return false;
    }

    // Si la ruta comienza con /admin, verificar que el usuario sea administrador
    if (state.url.startsWith('/admin')) {
      // Match the same logic as the backend - check for 'admin' or 'administrador' (case insensitive)
      const userType = currentUser.tipus_acc.toLowerCase();
      if (userType !== 'admin' && userType !== 'administrador') {
        this.notificationService.showError('No tienes permisos de administrador');
        this.router.navigate(['/']);
        return false;
      }
    }

    return true;
  }
}