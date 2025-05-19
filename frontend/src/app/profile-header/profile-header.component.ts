import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../environments/environment'; // Afegir aquesta importació

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.css']
})
export class ProfileHeaderComponent {
  @Input() username: string = '';
  @Input() email: string = '';
  @Input() profileImage: string | null = null;
  @Input() saldo: number = 0;
  @Input() activeTab: 'profile' | 'bets' | 'history' | 'edit' = 'profile';

  getInitials(): string {
    if (!this.username) return '';

    const names = this.username.split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    } else {
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    }
  }

  /**
   * Gets the proper image URL for display
   * Handles both relative paths and full URLs
   */
  getImageUrl(imagePath: string | null): string {
    if (!imagePath) return 'assets/default-profile.png';

    // Check if the image path already includes http or https
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // If it's a relative path, prepend the API base URL
    if (!imagePath.startsWith('assets/')) {
      return `${environment.apiUrl.replace('/api', '')}/${imagePath}`;
    }

    return imagePath;
  }
}