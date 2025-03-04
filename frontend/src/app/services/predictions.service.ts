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
} 