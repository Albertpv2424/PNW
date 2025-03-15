import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

// Update the User interface to include profile_image
interface User {
  nick: string;
  email: string;
  tipus_acc: string;
  saldo: number;
  dni: string;
  telefon?: string;
  data_naixement: string;
  profile_image?: string; // Make sure this field is included
}

interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  //private apiUrl = 'http://localhost/odds-api-laravel/public/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  register(userData: any): Observable<AuthResponse> {
    // Check if userData is FormData or regular object
    if (!(userData instanceof FormData)) {
      const formData = new FormData();
      Object.keys(userData).forEach(key => {
        formData.append(key, userData[key]);
      });
      userData = formData;
    }

    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData);
  }

  // Update the login method to accept either nick or email
  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
  // We keep the parameter name as 'email' for backward compatibility
  // but the backend will handle it as either email or nick
  return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
    .pipe(
      tap(response => {
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        this.currentUserSubject.next(response.user);
      })
    );
}

  logout(navigateToLogin: boolean = true): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);

    if (navigateToLogin) {
      this.router.navigate(['/login']);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Add this method if it doesn't exist
  updateCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
  }

  // Add this method to your AuthService
  // Añadir este método para el restablecimiento de contraseña
  resetPassword(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, {
      email: email,
      password: password
    });
  }
}