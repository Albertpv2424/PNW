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
    return this.http.post(`${this.apiUrl}/premios/${premioId}/canjear`, {});
  }

  getPromociones(): Observable<any> {
    return this.http.get(`${this.apiUrl}/promociones`);
  }

  inscribirPromocion(promocionId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/promociones/${promocionId}/inscribir`, {});
  }
}