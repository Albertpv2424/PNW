import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserLimitationsService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getAllUsersLimitations(): Observable<any[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/admin/user-limitations`, { headers });
  }

  getUserLimitations(username: string): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/admin/user-limitations/${username}`, { headers });
  }

  updateUserLimitations(username: string, limitations: { max_daily_bets: number, max_daily_betting_time: number }): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<any>(`${this.apiUrl}/admin/user-limitations/${username}`, limitations, { headers });
  }

  resetUserLimitations(username: string): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/admin/user-limitations/${username}/reset`, {}, { headers });
  }

  toggleUserLimitations(username: string, enabled: boolean): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<any>(`${this.apiUrl}/admin/user-limitations/${username}/toggle`, { enabled }, { headers });
  }

  setGlobalLimitations(limitations: { max_daily_bets: number, max_daily_betting_time: number }): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/admin/user-limitations/global`, limitations, { headers });
  }

  getDefaultLimitations(): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/admin/user-limitations/defaults`, { headers });
  }

  getCurrentUserLimitations(): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/user/limitations`, { headers });
  }

  // Add this method to the UserLimitationsService class
  
  // Actualizar el tiempo gastado por el usuario
  updateUserTimeSpent(timeSpent: number): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/user/update-time-spent`, { time_spent: timeSpent }, { headers });
  }
}