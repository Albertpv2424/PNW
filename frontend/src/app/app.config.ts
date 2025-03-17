import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([
      // Registrar el interceptor aquí
      (req, next) => {
        const token = localStorage.getItem('token');
        if (token) {
          const authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/json')
          });
          console.log('Interceptor añadiendo token a la solicitud:', authReq);
          return next(authReq);
        }
        return next(req);
      }
    ]))
  ]
};
