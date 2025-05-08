import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PredictionsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPredictions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/predictions`);
  }

  getPromotions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/promotions`);
  }

  getGalleryImages(): Observable<any> {
    return this.http.get(`${this.apiUrl}/gallery`);
  }

  // Actualizar el método existente o añadir uno nuevo
  getPremios(): Observable<any> {
    return this.http.get(`${this.apiUrl}/premios`);
  }

  canjearPremio(premioId: number): Observable<any> {
    // Get the authentication token
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No authentication token found');
      return new Observable(observer => {
        observer.error({ error: { message: 'No estás autenticado. Por favor, inicia sesión.' } });
      });
    }

    // Create headers with the token
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    console.log(`Sending redemption request for prize ID: ${premioId}`);

    // Include the headers in the request
    return this.http.post(`${this.apiUrl}/premios/${premioId}/canjear`, {}, { headers })
      .pipe(
        tap(response => {
          console.log('Prize redemption response:', response);
          // Ensure we have a valid response object
          if (typeof response !== 'object' || response === null) {
            console.error('Invalid response format:', response);
          }
        }),
        catchError(error => {
          console.error('Prize redemption error:', error);
          return throwError(() => error);
        })
      );
  }

  getPromociones(): Observable<any> {
    // Obtener el idioma actual del localStorage
    const currentLang = localStorage.getItem('preferredLanguage') || 'es';
    
    // Incluir el parámetro de idioma en la solicitud
    return this.http.get(`${this.apiUrl}/promociones?lang=${currentLang}`)
      .pipe(
        tap(response => {
          console.log('Promociones response:', response);
        }),
        catchError(error => {
          console.error('Error fetching promociones:', error);
          return throwError(() => error);
        })
      );
  }

  inscribirPromocion(promocionId: number): Observable<any> {
    // Get the authentication token directly from localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No authentication token found');
      return new Observable(observer => {
        observer.error({ error: { message: 'No estás autenticado. Por favor, inicia sesión.' } });
      });
    }

    // Create headers with the token
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    console.log('URL completa:', `${this.apiUrl}/promociones/${promocionId}/inscribir`);
    console.log('Headers enviados:', headers);

    // Use HttpClient instead of XMLHttpRequest for better integration with Angular
    return this.http.post(`${this.apiUrl}/promociones/${promocionId}/inscribir`, {}, { headers });
  }

  // Add this method to your PredictionsService

  getUserPremios(): Observable<any> {
    // Get the authentication token
    const token = localStorage.getItem('token');
    // Get the current language from localStorage
    const currentLang = localStorage.getItem('preferredLanguage') || 'es';

    if (!token) {
      console.error('No authentication token found');
      return new Observable(observer => {
        observer.error({ error: { message: 'No estás autenticado. Por favor, inicia sesión.' } });
      });
    }

    // Create headers with the token
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    console.log('Getting user prizes with language:', currentLang);
    
    // Use the translated endpoint with language parameter
    return this.http.get(`${this.apiUrl}/user/premios/translated?lang=${currentLang}`, { headers })
      .pipe(
        tap(response => {
          console.log('User prizes response (translated):', response);
        }),
        catchError(error => {
          console.error('Error fetching translated user prizes:', error);
          
          // If the translated endpoint fails, try the original endpoint
          console.log('Falling back to original user/premios endpoint');
          return this.http.get(`${this.apiUrl}/user/premios`, { headers })
            .pipe(
              tap(response => {
                console.log('User prizes response (fallback):', response);
              }),
              catchError(fallbackError => {
                console.error('Error fetching user prizes (fallback):', fallbackError);
                return throwError(() => fallbackError);
              })
            );
        })
      );
}}