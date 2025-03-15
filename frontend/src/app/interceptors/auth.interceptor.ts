import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');

    if (token) {
      // Clonar la solicitud y añadir el token de autorización
      const authReq = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
      });

      console.log('Interceptor añadiendo token a la solicitud:', authReq);
      return next.handle(authReq);
    }

    return next.handle(request);
  }
}