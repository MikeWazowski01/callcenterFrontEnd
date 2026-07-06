import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {

    const isAuthenticated = !!localStorage.getItem('tokenCallCenter');

    if (!isAuthenticated) {
      return this.router.createUrlTree(['/login']);
    }

    if (this.auth.isTokenExpired()) {
      this.auth.LogOut();
      return this.router.createUrlTree(['/login']);
    }

    // Opcional: validación de permisos
    if (state.url !== '/home') {
      // const hasPermission = this.authService.GetPermissionPathRoute(state.url);
      // if (!hasPermission) return this.router.createUrlTree(['/home']);
    }

    return true;
  }
}
