import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BetService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Get active bets for the current user
  getUserActiveBets(): Observable<any[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/user/bets/active`, { headers });
  }

  // Get bet history (completed bets) for the current user
  getUserBetHistory(): Observable<any[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/user/bets/history`, { headers });
  }

  // Get user bet statistics
  getUserBetStats(): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/user/bets/stats`, { headers });
  }

  // Get count of bets placed today
  getTodayBetsCount(): Observable<number> {
    // Si el usuario no está autenticado, devolver 0
    if (!this.authService.isLoggedIn()) {
      return of(0);
    }

    const headers = this.authService.getAuthHeaders();
    // Añadir un timestamp para evitar caché
    const timestamp = new Date().getTime();

    // En lugar de usar el endpoint específico para contar apuestas,
    // usaremos el endpoint de limitaciones que ya incluye bets_today
    return this.http.get(`${this.apiUrl}/user/limitations`, {
      headers,
      responseType: 'text'
    }).pipe(
      map(response => {
        try {
          const parsed = JSON.parse(response);
          // Extraer específicamente bets_today
          if (parsed && typeof parsed.bets_today === 'number') {
            console.log('Apuestas hoy (bets_today):', parsed.bets_today);
            return parsed.bets_today;
          } else {
            console.warn('No se encontró bets_today en la respuesta:', parsed);
            return 0;
          }
        } catch (e) {
          console.warn('No se pudo parsear la respuesta:', response);
          return 0;
        }
      }),
      catchError(error => {
        console.error('Error al obtener las limitaciones del usuario:', error);
        return of(0);
      })
    );
  }
}