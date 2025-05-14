import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
// Add these imports at the top if they're not already there
import { catchError, tap, throwError } from 'rxjs';
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
  public getAuthHeaders(isFormData: boolean = false): HttpHeaders {
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
  // Update or add the deleteUser method to handle complete deletion
  deleteUser(id: number | string): Observable<any> {
    if (!id) {
      console.error('ID de usuario inválido:', id);
      return throwError(() => new Error('ID de usuario no válido'));
    }

    console.log(`Intentando eliminar usuario con ID/nick: ${id}`);

    // Use the delete-all-data endpoint
    return this.http.delete<any>(`${this.apiUrl}/users/${id}/delete-all-data`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(response => console.log('Respuesta de eliminación:', response)),
      catchError(error => {
        console.error('Error detallado al eliminar datos de usuario:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          message: error.message
        });

        // Mensaje de error más descriptivo
        const errorMessage = error.error?.message || 'Error al eliminar los datos del usuario';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // Actualizar el saldo de un usuario
  updateUserBalance(userId: string | number, amount: number): Observable<any> {
    console.log(`Updating balance for user ID: ${userId}, Amount: ${amount}`);

    // Create the request payload
    const payload = { saldo: amount };

    // Log the headers being sent
    const headers = this.authService.getAuthHeaders();
    console.log('Request headers:', headers);

    // Make the request with detailed error handling - changed from PUT to POST
    return this.http.post(`${environment.apiUrl}/admin/users/${userId}/balance`, payload, {
      headers: headers
    }).pipe(
      tap(response => console.log('Balance update response:', response)),
      catchError(error => {
        console.error('Detailed balance update error:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          message: error.message
        });

        // Check if there's a more specific error message from the server
        const errorMessage = error.error?.message || 'Error al actualizar el saldo';

        // Re-throw the error with more context
        return throwError(() => new Error(errorMessage));
      })
    );
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

  // Add this helper method after the getAuthHeaders method
  getFullImageUrl(imagePath: string | null): string {
    if (!imagePath) return '';

    // Check if the image path already includes http or https
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // Otherwise, prepend the base URL
    return `http://localhost:8000/${imagePath}`;
  }

  // Promotion management methods
  getPromociones(): Observable<any> {
    // Change from 'promociones' to 'promotions' to match the backend route
    return this.http.get<any>(`${this.apiUrl}/promotions`, {
      headers: this.getAuthHeaders()
    });
  }

  getTiposPromocion(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tipos-promocion`, {
      headers: this.getAuthHeaders()
    });
  }

  createPromocion(promocionData: FormData): Observable<any> {
    // Change from 'promociones' to 'promotions' to match the backend route
    return this.http.post<any>(`${this.apiUrl}/promotions`, promocionData, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`,
        'Accept': 'application/json'
        // Note: Deliberately NOT setting 'Content-Type' for FormData
      })
    });
  }

  updatePromocion(id: number, promocionData: FormData): Observable<any> {
    // Change from 'promociones' to 'promotions' to match the backend route
    return this.http.post<any>(`${this.apiUrl}/promotions/${id}`, promocionData, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`,
        'Accept': 'application/json'
        // Note: Deliberately NOT setting 'Content-Type' for FormData
      })
    });
  }

  deletePromocion(id: number): Observable<any> {
    // Change from 'promociones' to 'promotions' to match the backend route
    return this.http.delete<any>(`${this.apiUrl}/promotions/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
