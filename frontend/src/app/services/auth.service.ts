import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';

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
    private router: Router,
    private notificationService: NotificationService // Añade esto
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
      }),
      catchError((error) => {
        if (error.status === 403 && error.error?.reason === 'time_limit') {
          // Mostrar mensaje de bloqueo por tiempo usando NotificationService
          this.notificationService.showError('Has superado el tiempo máximo de juego diario. No puedes iniciar sesión hasta mañana.');
          // Asegurarse de que no se guarde ningún usuario ni token
          localStorage.removeItem('currentUser');
          localStorage.removeItem('token');
          this.currentUserSubject.next(null);
        }
        return throwError(() => error);
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

  // Keep only ONE implementation of getCurrentUser
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Add this method if it doesn't exist
  updateCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    console.log('User updated:', user);
  }

  // Update the updateUserSaldo method
  updateUserSaldo(saldo: number): void {
    // Get current user
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      // Update saldo
      currentUser.saldo = saldo;
      console.log('Updating user saldo to:', saldo);

      // Update in localStorage
      localStorage.setItem('currentUser', JSON.stringify(currentUser));

      // Update in the subject - create a new object to ensure change detection
      this.currentUserSubject.next({...currentUser});
    } else {
      console.error('Cannot update saldo: No current user found');
    }
  }

  // Add this method to your AuthService
  // Añadir este método para el restablecimiento de contraseña
  resetPassword(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, {
      email: email,
      password: password
    });
  }

  // Add this method to check if the token is valid
  checkTokenValidity(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if (!token) {
      return of(false);
    }

    // Create a simple endpoint in your backend to validate tokens
    return this.http.get<{valid: boolean}>(`${this.apiUrl}/validate-token`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      map(response => response.valid),
      catchError(() => {
        // If there's an error, the token is invalid
        this.logout();
        return of(false);
      })
    );
  }

  // Añade este método para refrescar el token
  refreshToken(): Observable<any> {
    return this.http.get(`${this.apiUrl}/refresh-token`, {
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: true
    }).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  // Request a password reset email
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/request-password-reset`, { email });
  }

  resetPasswordWithToken(email: string, password: string, token: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password-with-token`, {
      email,
      password,
      token
    });
  }

  // Add this method to your AuthService
  // Add these methods if they don't already exist

  // Add or update this method in your AuthService
  // Add or update the isAdmin method
  // Update the isAdmin method to be more flexible
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    if (!user) {
      console.log('No user found when checking admin status');
      return false;
    }
  
    // Make sure tipus_acc exists before trying to use toLowerCase()
    if (!user.tipus_acc) {
      console.log('User has no tipus_acc property:', user);
      return false;
    }
  
    // Case-insensitive check for admin status
    const userType = user.tipus_acc.toLowerCase();
    console.log('Checking admin status for user:', user.nick, 'Type:', userType);
  
    // More flexible check for various admin type strings
    const isAdmin = ['admin', 'administrador', 'administrator'].includes(userType);
    console.log('Is admin?', isAdmin);
  
    return isAdmin;
  }


  // Also, let's add a getAuthHeaders method if it doesn't exist
  // Update the getAuthHeaders method to handle multipart/form-data
  // Update this method in your AuthService
  getAuthHeaders(): any {
    const token = this.getToken();
    const headers: {[key: string]: string} = {
      'Accept': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }
}