import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

    // Include the headers in the request
    return this.http.post(`${this.apiUrl}/premios/${premioId}/canjear`, {}, { headers });
  }

  getPromociones(): Observable<any> {
    return this.http.get(`${this.apiUrl}/promociones`);
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
}