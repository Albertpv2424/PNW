import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class PremiosService {
  private apiUrl = environment.apiUrl;
  private currentLang = 'es';

  // BehaviorSubject to store and emit premios data
  private premiosSubject = new BehaviorSubject<any[]>([]);

  // Observable that components can subscribe to
  premios$ = this.premiosSubject.asObservable();

  constructor(
    private http: HttpClient,
    private languageService: LanguageService
  ) {
    // Subscribe to language changes
    this.languageService.currentLang.subscribe(lang => {
      this.currentLang = lang;
      this.refreshPremios();
    });

    // Initial load
    this.refreshPremios();
  }

  /**
   * Refrescar los datos de premios desde el servidor
   */
  private refreshPremios(): void {
    this.http.get<any[]>(`${this.apiUrl}/premios?lang=${this.currentLang}`)
      .subscribe({
        next: (data) => {
          this.premiosSubject.next(data);
        },
        error: (err) => {
          // Keep error handling but remove console.error
        }
      });
  }

  /**
   * Obtener todos los premios disponibles con traducciones para el idioma actual
   */
  getPremios(): Observable<any[]> {
    // Devolver los datos en caché y activar una actualización
    return this.premios$;
  }

  /**
   * Get a specific prize by ID with translations for the current language
   */
  getPremioById(id: number): Observable<any> {
    console.log('PremiosService: Getting prize by ID', id, 'with language', this.currentLang);
    return this.http.get<any>(`${this.apiUrl}/premios/${id}?lang=${this.currentLang}`)
      .pipe(
        tap(response => {
          console.log('PremiosService: Received prize details', response);
        })
      );
  }

  /**
   * Redeem a prize for the current user
   */
  redeemPremio(premioId: number): Observable<any> {
    console.log('PremiosService: Redeeming prize with ID', premioId);

    // CHANGE: Make sure this endpoint matches the Laravel route
    return this.http.post<any>(`${this.apiUrl}/premios/${premioId}/canjear`, {})
      .pipe(
        tap(response => {
          console.log('PremiosService: Prize redemption response', response);
          // Refresh premios after redeeming
          this.refreshPremios();
        }),
        catchError(error => {
          console.error('PremiosService: Error redeeming prize', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Get prizes redeemed by the current user with translations
   */
  getUserPremios(): Observable<any[]> {
    console.log('PremiosService: Getting user prizes with language', this.currentLang);
    return this.http.get<any[]>(`${this.apiUrl}/user/premios/translated?lang=${this.currentLang}`)
      .pipe(
        tap(response => {
          console.log('PremiosService: Received user prizes', response);
        }),
        catchError(error => {
          console.error('PremiosService: Error fetching user prizes', error);
          return throwError(() => error);
        })
      );
  }
}