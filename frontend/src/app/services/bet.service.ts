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
  // Find the getTodayBetsCount method and update it:
  getTodayBetsCount(): Observable<number> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/user/bets/today/count`, { headers }).pipe(
      map(response => {
        // Remove console.log
        return response.bets_today || 0;
      }),
      catchError(error => {
        // Keep error handling but remove console.error
        return of(0);
      })
    );
  }
}