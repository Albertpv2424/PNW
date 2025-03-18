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
    console.log('AuthGuard - Current user:', currentUser);
    
    if (!currentUser) {
      console.log('AuthGuard - No user found, redirecting to login');
      this.notificationService.showError('Debes iniciar sesión para acceder a esta página');
      this.router.navigate(['/login']);
      return false;
    }

    // Verificar si el usuario es administrador
    const isAdmin = currentUser.tipus_acc && 
                   ['admin', 'Admin', 'administrador', 'Administrador'].includes(
                     currentUser.tipus_acc.toString().trim()
                   );

    // Si la ruta comienza con /admin, verificar que el usuario sea administrador
    if (state.url.startsWith('/admin')) {
      console.log('AuthGuard - Admin route detected, user type:', currentUser.tipus_acc);
      
      if (!isAdmin) {
        console.log('AuthGuard - User is not admin, redirecting to home');
        this.notificationService.showError('No tienes permisos de administrador');
        this.router.navigate(['/']);
        return false;
      }
    } else {
      // Si la ruta NO comienza con /admin, verificar que el usuario NO sea administrador
      // Esto evita que los administradores accedan a las rutas de usuario normal
      if (isAdmin && !state.url.startsWith('/login') && !state.url.startsWith('/register')) {
        console.log('AuthGuard - Admin trying to access user route, redirecting to admin dashboard');
        this.router.navigate(['/admin/dashboard']);
        return false;
      }
    }

    console.log('AuthGuard - Access granted');
    return true;
  }
}