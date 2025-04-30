import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, catchError, timeout } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { ClickOutsideDirective } from '../directives/click-outside.directive';
import { DailyWheelComponent } from '../daily-wheel/daily-wheel.component';
import { LanguageSliderComponent } from '../language-slider/language-slider.component';
import { LanguageService } from '../services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { BettingTimerComponent } from '../betting-timer/betting-timer.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ClickOutsideDirective,
    DailyWheelComponent,
    FormsModule,
    LanguageSliderComponent,
    TranslateModule,
    BettingTimerComponent // Add this line to include the component in imports
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

  // Add this property
  currentLanguage: string = 'es';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private languageService: LanguageService
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

    // Subscribe to language changes
    this.languageService.currentLang.subscribe(lang => {
      this.currentLanguage = lang;
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

  // Update the toggleLanguage method
  toggleLanguage(): void {
    // Get all available languages
    const languages = this.languageService.getAvailableLanguages();

    // Find the index of the current language
    const currentIndex = languages.findIndex(lang => lang.code === this.currentLanguage);

    // Get the next language (cycle back to the first if at the end)
    const nextIndex = (currentIndex + 1) % languages.length;
    const nextLang = languages[nextIndex].code;

    // Set the new language
    this.languageService.setLanguage(nextLang);
  }
  
  // Add this method if it doesn't exist
  isUserLoggedIn(): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    console.log('User logged in status:', isLoggedIn);
    return isLoggedIn;
  }
  
  // Añadir este método al HeaderComponent
  // Modificar el método navigateToHome para resetear la selección de deportes
  navigateToHome(): void {
    // Emitir un evento personalizado que el HomeComponent pueda escuchar
    const resetEvent = new CustomEvent('reset-sport-selection', {
      bubbles: true,
      detail: { reset: true }
    });
    window.dispatchEvent(resetEvent);
    
    // Navegar a la página principal
    this.router.navigate(['/']);
  }
}
