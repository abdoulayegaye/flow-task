import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Intercepted request:', req);
  //Ne pas ajouter le token pour la requete de login
  if(req.url.includes('/protocol/openid-connect/token')) return next(req);

  const token = inject(AuthService).getToken();
  if (!token) return next(req);
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` }}));
};
