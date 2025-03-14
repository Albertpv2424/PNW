import { Component, Input, Output, EventEmitter } from '@angular/core';
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
export class HeaderComponent {
  @Input() username: string = '';
  @Input() profileImage: string | null = null;
  @Output() logoutEvent = new EventEmitter<void>();
  @Output() searchEvent = new EventEmitter<string>();
  
  isProfileMenuOpen: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.username = user.nick;
      this.profileImage = user.profile_image || null;
    }
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  closeProfileMenu(): void {
    this.isProfileMenuOpen = false;
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
