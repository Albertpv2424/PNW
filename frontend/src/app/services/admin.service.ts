import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8000/api/admin';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Obtener todos los usuarios
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Obtener un usuario específico
  getUser(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Crear un nuevo usuario
  createUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users`, userData, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Actualizar un usuario existente
  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${id}`, userData, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Eliminar un usuario
  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Actualizar el saldo de un usuario
  updateUserBalance(nick: string, amount: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/${nick}/balance`, { amount }, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Cambiar el tipo de cuenta de un usuario
  changeUserRole(nick: string, role: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/${nick}/role`, { role }, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Obtener estadísticas generales
  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Get dashboard statistics
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
