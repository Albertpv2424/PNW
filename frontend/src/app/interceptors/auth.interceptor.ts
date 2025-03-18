import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');

    console.log('Interceptor procesando solicitud a:', request.url);

    if (token) {
      // Clonar la solicitud y añadir el token de autorización
      let authReq = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
          .set('Accept', 'application/json')
      });

      // No modificar el Content-Type si es una solicitud FormData
      if (!(request.body instanceof FormData)) {
        authReq = authReq.clone({
          headers: authReq.headers.set('Content-Type', 'application/json')
        });
      }

      console.log('Interceptor añadiendo token a la solicitud:', authReq.url);

      return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          // Si recibimos un error 401 (No autorizado), el token podría haber expirado
          if (error.status === 401) {
            console.error('Error de autenticación 401, cerrando sesión');
            // Aquí deberías llamar al servicio de autenticación para cerrar sesión
            // this.authService.logout();
            // this.router.navigate(['/login']);
          }
          return throwError(() => error);
        })
      );
    }

    return next.handle(request);
  }
}