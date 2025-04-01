import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ClickOutsideDirective } from '../directives/click-outside.directive';
import { DailyWheelComponent } from '../daily-wheel/daily-wheel.component';
import { RouterLinkActive } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { debounceTime, distinctUntilChanged, filter, switchMap, catchError, timeout } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    ClickOutsideDirective,
    DailyWheelComponent,
    FormsModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() username: string | null = null;
  profileImage: string | null = null;
  isProfileMenuOpen = false;
  saldo: number = 0;
  
  // Search functionality
  searchQuery: string = '';
  searchResults: any[] = [];
  showSearchResults: boolean = false;
  private searchSubject = new Subject<string>();
  private apiUrl = environment.apiUrl;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      if (!this.username) {
        this.username = user ? user.nick : null;
      }
      this.profileImage = user && user.profile_image ? user.profile_image : null;
      this.saldo = user ? user.saldo : 0;
    });
    
    // Set up search with debounce and error handling
    // In the ngOnInit method, update the search pipe configuration:
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(term => term.length >= 3),
      switchMap(term => {
        console.log('Searching for:', term);
        return this.http.get(`${this.apiUrl}/search?q=${term}`)
          .pipe(
            timeout(30000), // Increase timeout from 10s to 30s
            catchError(error => {
              console.error('Search error:', error);
              // Show a notification to the user
              if (error.name === 'TimeoutError') {
                // You can inject NotificationService and use it here
                console.error('Search request timed out. Please try again later.');
              }
              return of({ results: [] });
            })
          );
      })
    ).subscribe({
      next: (response: any) => {
        console.log('Search results:', response);
        this.searchResults = response.results || [];
        this.showSearchResults = this.searchResults.length > 0;
      },
      error: (error) => {
        console.error('Search subscription error:', error);
        this.searchResults = [];
        this.showSearchResults = false;
      }
    });
  }
  
  isActive(route: string): boolean {
    return this.router.url === route ||
           (route === '/' && (this.router.url === '/home' || this.router.url === ''));
  }
  
  onSearch() {
    console.log('Search query:', this.searchQuery);
    if (this.searchQuery.length >= 3) {
      this.searchSubject.next(this.searchQuery);
    } else {
      this.searchResults = [];
      this.showSearchResults = false;
    }
  }
  
  selectResult(result: any) {
    console.log('Selected result:', result);
    // Navigate to the event details page
    this.router.navigate(['/sports', result.sport_key, result.id]);
    this.searchQuery = '';
    this.searchResults = [];
    this.showSearchResults = false;
  }
  
  closeSearchResults() {
    setTimeout(() => {
      this.showSearchResults = false;
    }, 200);
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
  
  ngOnDestroy() {
    this.searchSubject.complete();
  }
}
