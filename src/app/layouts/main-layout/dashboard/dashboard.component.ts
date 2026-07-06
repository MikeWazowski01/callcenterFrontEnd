import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiServiceService } from '../../../core/services/api.service.service';
import { IMenuResponse, IMenus } from '../../../shared/models/Menus';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {
  //  // src="https://i.pravatar.cc/40"
  MENUS: IMenus[] = [];
  isHovered = false;
  logo: string = 'img/logo_small.png';
  usuario: string = '';
  urlAvatar: string = 'http://core-dev.grupoconserva.mx/callcenter/avatar/avatar.jpg';//'/avatar/avatar.jpg';

  constructor(
    private HTTPSERVICE: ApiServiceService,
    private authService: AuthService) {
  }

  ngOnInit() {

    if (typeof window !== 'undefined') {

      const token = this.authService.getToken();

      if (token) {
        const decodeToken = this.authService.DecodeToken(token);

        this.usuario = decodeToken.NombreUsuario;
        localStorage.setItem('usuario', this.usuario);
        this.MENUS = (JSON.parse(decodeToken.Menu) as IMenus[]).map(menu => ({
          ...menu,
          subMenus: Array.isArray(menu.SubMenus) ? menu.SubMenus : []
        }));
      }

    }
  }

  logout() {
    this.authService.LogOut();
  }

  getMenus(): Observable<IMenus[]> {

    return this.HTTPSERVICE.HttpGet<IMenuResponse>('Menu/get-menu', {}).pipe(
      map((response) => {
        return response.data
      }),
      catchError((error) => {
        return throwError(() => new Error('Error para obtener datos de los menus.'));
      })
    );

  }

  expandedMenu(expanded: boolean) {

    this.isHovered = expanded;

    if (expanded) {
      this.logo = 'img/logo_big.png';
    } else {
      this.logo = 'img/logo_small.png';
    }

  }
}
