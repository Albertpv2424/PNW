import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    const headers = this.authService.getAuthHeaders();
    return this.http.get<number>(`${this.apiUrl}/user/bets/today/count`, { headers });
  }
}