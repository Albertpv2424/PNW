import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8000/api/admin';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Método para obtener los headers de autenticación
  // Update the getAuthHeaders method
  private getAuthHeaders(isFormData: boolean = false): HttpHeaders {
    const token = this.authService.getToken();

    if (!token) {
      console.error('No se encontró token de autenticación');
      return new HttpHeaders({
        'Accept': 'application/json'
      });
    }

    console.log('Token utilizado en AdminService:', token.substring(0, 10) + '...');

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });

    // Solo añadir Content-Type si no es FormData
    if (!isFormData) {
      headers = headers.set('Content-Type', 'application/json');
    }

    return headers;
  }

  // Obtener todos los usuarios
  getUsers(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    console.log('Headers enviados en getUsers:', headers);

    return this.http.get<any[]>(`${this.apiUrl}/users`, {
      headers: headers
    });
  }

  // Obtener un usuario específico
  getUser(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Crear un nuevo usuario
  createUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users`, userData, {
      headers: this.getAuthHeaders()
    });
  }

  // Actualizar un usuario existente
  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${id}`, userData, {
      headers: this.getAuthHeaders()
    });
  }

  // Eliminar un usuario
  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Actualizar el saldo de un usuario
  updateUserBalance(nick: string, amount: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/${nick}/balance`, { amount }, {
      headers: this.getAuthHeaders()
    });
  }

  // Cambiar el tipo de cuenta de un usuario
  changeUserRole(nick: string, role: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/${nick}/role`, { role }, {
      headers: this.getAuthHeaders()
    });
  }

  // Obtener estadísticas generales
  getStats(): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log('Headers enviados en getStats:', headers);

    return this.http.get<any>(`${this.apiUrl}/stats`, {
      headers: headers
    });
  }

  // Get dashboard statistics
  getDashboardStats(): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log('URL completa:', `${this.apiUrl}/stats`);
    console.log('Headers enviados en getDashboardStats:', headers);

    return this.http.get<any>(`${this.apiUrl}/stats`, {
      headers: headers
    });
  }

  // Métodos para gestionar promociones
  // Update the getPromociones method in the AdminService
  // Make sure these methods are correctly implemented
  getPromociones(): Observable<any> {
    // Remove the duplicate 'admin' in the URL path
    return this.http.get<any>(`${this.apiUrl}/promotions`, {
      headers: this.getAuthHeaders()
    });
  }

  getTiposPromocion(): Observable<any> {
    // Remove the duplicate 'admin' in the URL path
    return this.http.get<any>(`${this.apiUrl}/tipos-promocion`, {
      headers: this.getAuthHeaders()
    });
  }

  getPromocion(id: number): Observable<any> {
    // Fix the URL to use 'promotions' instead of 'promociones'
    return this.http.get<any>(`${this.apiUrl}/promotions/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  createPromocion(promocionData: FormData): Observable<any> {
    // Fix the URL to use 'promotions' instead of 'promociones'
    return this.http.post<any>(`${this.apiUrl}/promotions`, promocionData, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
        // No incluimos Content-Type para que Angular lo establezca automáticamente con el boundary para FormData
      })
    });
  }

  updatePromocion(id: number, promocionData: FormData): Observable<any> {
    // Fix the URL to use 'promotions' instead of 'promociones'
    return this.http.post<any>(`${this.apiUrl}/promotions/${id}`, promocionData, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    });
  }

  deletePromocion(id: number): Observable<any> {
    // Fix the URL to use 'promotions' instead of 'promociones'
    return this.http.delete<any>(`${this.apiUrl}/promotions/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Add these methods to your AdminService class

  // Get pending bets
  getPendingBets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bets/pending`, {
      headers: this.getAuthHeaders()
    });
  }
  
  // Get verified bets
  getVerifiedBets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bets/verified`, {
      headers: this.getAuthHeaders()
    });
  }
  
  // Verify a bet
  verifyBet(betId: number, data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/bets/${betId}/verify`, data, {
      headers: this.getAuthHeaders()
    });
  }
}
