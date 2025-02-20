import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OddsService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  getSports(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sports`);
  }

  getOdds(sportKey: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/odds/${sportKey}`);
  }
} 