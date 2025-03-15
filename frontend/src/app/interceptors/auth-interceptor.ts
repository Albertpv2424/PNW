import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get the token from localStorage
    const token = localStorage.getItem('token');

    // If we have a token, add it to the request
    if (token) {
      // Clone the request and add the authorization header
      const authReq = request.clone({
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }),
        withCredentials: true
      });

      // Pass the cloned request with the token to the next handler
      return next.handle(authReq);
    }

    // If no token, pass the request through unchanged
    return next.handle(request);
  }
}