import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ClickOutsideDirective } from '../directives/click-outside.directive';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, ClickOutsideDirective],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  username: string | null = null;
  profileImage: string | null = null;
  isProfileMenuOpen = false;
  saldo: number = 0; // Add this property

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.username = user ? user.nick : null;
      this.profileImage = user && user.profile_image ? user.profile_image : null;
      this.saldo = user ? user.saldo : 0; // Set the saldo from the user object
      console.log('Current user saldo:', this.saldo); // Add this line to debug
    });
  }
  // Método para verificar si la ruta actual está activa
  isActive(route: string): boolean {
    return this.router.url === route ||
           (route === '/' && (this.router.url === '/home' || this.router.url === ''));
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;

    // Emitir un evento personalizado cuando el menú cambia
    const event = new CustomEvent('profile-menu-toggle', {
      detail: { isOpen: this.isProfileMenuOpen }
    });
    window.dispatchEvent(event);
  }

  closeProfileMenu() {
    if (this.isProfileMenuOpen) {
      this.isProfileMenuOpen = false;

      // Emitir un evento personalizado cuando el menú se cierra
      const event = new CustomEvent('profile-menu-toggle', {
        detail: { isOpen: false }
      });
      window.dispatchEvent(event);
    }
  }

  logout(): void {
    // Call the logout method with false to prevent navigation to login
    this.authService.logout(false);

    // Refresh the page to update UI
    window.location.reload();
  }

  getInitials(): string {
    if (!this.username) return '';

    const names = this.username.split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    } else {
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    }
  }
}
