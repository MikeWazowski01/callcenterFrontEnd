import { Injectable, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { IMenus, IMenusPermisos } from '../../shared/models/Menus';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private isBrowser: boolean;
  private permisosUsuario$ = new BehaviorSubject<string[]>([]);
  private MenusPermisos: IMenusPermisos[] = [];
  private MenuGuardado: IMenusPermisos[] = [];
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private zone: NgZone,
    private dialog: MatDialog) {
    //this.cargarSesionDesdeAlmacenamiento();
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (isPlatformBrowser(this.platformId)) {
      this.cargarSesionDesdeAlmacenamiento();
    }

  }

  saveToken(token: string, menus: any) {
    if (this.isTokenExpired()) {
      this.logout();
    }
    if (this.isBrowser) {
      localStorage.setItem('tokenCallCenter', token);
      localStorage.setItem('menu_app', JSON.stringify(menus));

      //localStorage.setItem('menu_permisos', JSON.stringify(menuPermisosRaw));
      this.procesarMenuYPermisos(menus);
    }
  }

  private procesarMenuYPermisos(menuArray: IMenus[]) {
    try {
      // Convertimos el string "[{\"IdMenu\":1...]" en un Array de objetos real
      //const menuArray: IMenus[] = JSON.parse(menuStringRaw);

      // Mapeamos el array para convertir el string de permisos en un Arreglo de strings
      this.MenusPermisos = menuArray.map(item => {
        return {
          IdMenu: item.IdMenu,
          NombreMenu: item.NombreMenu,
          Ruta: item.Ruta,
          Icon: item.Icon,
          Orden: item.Orden,
          IdMenuPadre: item.IdMenuPadre,
          SubMenus: item.SubMenus,
          // Si trae permisos "Inicio:leer,Inicio:crear", los separa. Si viene vacío, deja un array vacío
          Permisos: item.Permisos ? item.Permisos.split(',') : []
        };
      });


      /*
       IdMenu: number,
     NombreMenu: string,
     Ruta: string,
     Icon: string,
     Orden: number,
     IdMenuPadre: number | null,
     Permisos: string[],
     SubMenus: IMenus[] */

      //console.log('Menú dinámico y permisos cargados con éxito:', this.menuUsuario);
    } catch (error) {
      console.error('Error al parsear el JSON de menús:', error);
    }
  }

  private cargarSesionDesdeAlmacenamiento() {
    const menus_app = localStorage.getItem('menu_app');
    if (menus_app) {
      this.procesarMenuYPermisos(JSON.parse(menus_app));
    }
  }

  tienePermiso(permiso: string): boolean {
    // Busca en todos los menús si alguno contiene el permiso solicitado en su lista

    return this.MenusPermisos.some(m => {
    
      return m.Permisos && m.Permisos.includes(permiso)
    }
    );
  }

  obtenerMenuParaSidebar(): IMenusPermisos[] {
    return this.MenusPermisos;
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('tokenCallCenter');
    }
    return null;
  }

  logout() {
    if (this.isBrowser) {
      localStorage.clear();
      localStorage.removeItem('tokenCallCenter');
      localStorage.removeItem('usuario');
    }
    this.dialog.closeAll();
    this.zone.run(() => {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    });
  }

  isTokenExpired(): boolean {
    try {
      if (this.jwtHelper.isTokenExpired(localStorage.getItem('tokenCallCenter')) === true) {
        return true;

      } else {
        return false;

      }
    } catch (e) {
      return true;
    }
  }

  DecodeToken(token: string) {
    const decodeToken = this.jwtHelper.decodeToken<any>(token);
    return decodeToken;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  LogOut() {
    localStorage.clear();
    localStorage.removeItem('tokenCallCenter');
    localStorage.removeItem('usuario');
    this.zone.run(() => {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    });
  }

  clearToken(): void {
    if (this.isBrowser) {
      localStorage.removeItem('tokenCallCenter');
      localStorage.removeItem('usuario');
    }
  }



}