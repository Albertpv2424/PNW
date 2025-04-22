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

  // Obtener limitaciones de todos los usuarios
  getAllUsersLimitations(): Observable<any[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/admin/user-limitations`, { headers });
  }

  // Obtener limitaciones de un usuario específico
  getUserLimitations(username: string): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/admin/user-limitations/${username}`, { headers });
  }

  // Actualizar limitaciones de un usuario
  updateUserLimitations(username: string, limitations: { max_daily_bets: number, max_daily_betting_time: number }): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<any>(`${this.apiUrl}/admin/user-limitations/${username}`, limitations, { headers });
  }

  // Reiniciar contadores de limitaciones de un usuario
  resetUserLimitations(username: string): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/admin/user-limitations/${username}/reset`, {}, { headers });
  }

  // Habilitar/deshabilitar limitaciones para un usuario
  toggleUserLimitations(username: string, enabled: boolean): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<any>(`${this.apiUrl}/admin/user-limitations/${username}/toggle`, { enabled }, { headers });
  }

  // Obtener limitaciones predeterminadas
  getDefaultLimitations(): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/admin/user-limitations/defaults`, { headers });
  }

  // Establecer limitaciones globales
  setGlobalLimitations(limitations: { max_daily_bets: number, max_daily_betting_time: number }): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/admin/user-limitations/global`, limitations, { headers });
  }

  // Obtener limitaciones del usuario actual (para usuarios normales)
  getCurrentUserLimitations(): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/user/limitations`, { headers });
  }
}