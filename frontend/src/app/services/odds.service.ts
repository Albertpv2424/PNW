import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OddsService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  getSports(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sports`).pipe(
      tap(data => console.log('Sports data:', data)),
      catchError(this.handleError)
    );
  }

  getOdds(sportKey: string): Observable<any> {
    // Special handling for tennis and baseball
    let endpoint = `${this.apiUrl}/odds/${sportKey}`;
    
    // Add special parameters for tennis and baseball
    if (sportKey === 'tennis_atp_miami_open' || 
        sportKey === 'tennis_grand_slam_masters_1000' || 
        sportKey === 'baseball_mlb') {
      endpoint += '?regions=us&markets=h2h';
    }
    
    return this.http.get(endpoint).pipe(
      tap(data => console.log(`Odds for ${sportKey}:`, data)),
      catchError(this.handleError)
    );
  }
  
  getScores(sportKey: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/scores/${sportKey}`).pipe(
      catchError(this.handleError)
    );
  }
  
  getEventResults(eventId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/events/${eventId}/results`).pipe(
      catchError(this.handleError)
    );
  }

  // Add the missing handleError method
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}