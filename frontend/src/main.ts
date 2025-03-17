import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([
      (req, next) => {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        
        // Check if this is an API request (all requests to your backend)
        const isApiRequest = req.url.includes('localhost:8000/api');
        
        // If we have a token and this is an API request, add the token
        if (token && isApiRequest) {
          // Clone the request and add the authorization header
          const authReq = req.clone({
            headers: req.headers
              .set('Authorization', `Bearer ${token}`)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/json'),
            withCredentials: true  // This sends cookies along with the request
          });
          
          console.log('Adding auth token to request:', req.url);
          return next(authReq);
        }
        
        // For non-API requests or when no token is available, pass the request through unchanged
        return next(req);
      }
    ])),
    provideRouter(routes)
  ]
}).catch(err => console.error(err));
