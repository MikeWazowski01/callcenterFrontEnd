import { Injectable } from '@angular/core';
import { IMenus } from '../../shared/models/Menus';
import { AuthService } from './auth.service';
import { PermisosEnum } from '../../shared/Enum/PermisosEnum';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  constructor(private authService: AuthService) { }

  getPermisos(): IMenus[] {

    const token = localStorage.getItem('tokenCallCenter');
    if (!token) return [];

    const decodeToken = this.authService.DecodeToken(token);
    const menus = JSON.parse(decodeToken.Menu) as IMenus[];


    return menus;
  }

  getPermisosDelMenu(menu: string): PermisosEnum[] {
    const menus: IMenus[] = this.getPermisos();
    const menuEncontrado = menus.find((m: IMenus) => m.NombreMenu === menu);

    if (!menuEncontrado) return [];

    return menuEncontrado.Permisos
      .split(',')
      .map(p => p.trim() as PermisosEnum);
  }

  hasPermission(menu: string, permiso: PermisosEnum): boolean {
    const permisos = this.getPermisosDelMenu(menu);
    return permisos.includes(permiso);
  }

}
