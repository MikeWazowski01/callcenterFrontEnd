import { inject } from '@angular/core';
import { HttpInterceptorFn, } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  const authReq = req.clone({
    setHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    withCredentials: true
  });

  return next(authReq).pipe(
    catchError(err => {

      if (err.status === 401 && router.url !== '/login') {
        authService.clearToken();
        router.navigate(['/login']);
      }

      return throwError(() => err);
    })
  );
};

