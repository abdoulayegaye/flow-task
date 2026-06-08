import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Ignorer les erreurs de l'endpoint de token (gérées dans le LoginComponent)
      if (error.status === 401 && !req.url.includes('/protocol/openid-connect/token')) {
        auth.logout();
      }
      return throwError(() => error);
    }),
  );
};
