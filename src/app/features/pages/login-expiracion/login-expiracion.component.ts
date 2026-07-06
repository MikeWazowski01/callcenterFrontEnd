import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AvisosComponent } from '../../../shared/avisos/avisos.component';
import { LoginService } from '../../../core/services/login/login.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IMenus } from '../../../shared/models/Menus';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login-expiracion',
  imports: [MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    CommonModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule],
  templateUrl: './login-expiracion.component.html',
  styleUrl: './login-expiracion.component.css'
})
export class LoginExpiracionComponent implements OnInit {
  //Variables
  loginForm: FormGroup;
  isApiLoading: boolean = false;
  logo: string = 'img/logo_login.png';
  durationInSeconds = 5;
  //Fin Variables

  //Dependencias
  private _snackBar = inject(MatSnackBar);
  //Fin Dependencias

  constructor(
    private authService: AuthService,
    private loginService: LoginService,
    private router: Router,
    private fb: FormBuilder,
    private jwtHelper: JwtHelperService) {

    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  login() {

    this.isApiLoading = true;
    this.loginService.HttpPost('Login/login', {}, this.loginForm.value).subscribe({
      next: (response) => {


        const decodeToken = this.authService.DecodeToken(response.data.token);
        const menus = JSON.parse(decodeToken.Menu) as IMenus[];


        if (menus.length > 0) {

          this.authService.saveToken(response.data.token, menus);


        } else {

          this.openSnackBar("El usuario no tiene asginado ningun menu..");

        }

        this.isApiLoading = false;
      },
      error: (error: HttpErrorResponse) => {

        if (error.status == 0) {

          this.isApiLoading = false;

          this.openSnackBar("Revisa tu conexión a internet :(");

        }
        else {

          this.isApiLoading = false;

          this.openSnackBar(error.error.message);

        }
      }
    });

  }

  openSnackBar(aviso: string) {

    this._snackBar.openFromComponent(AvisosComponent, {

      duration: this.durationInSeconds * 1000,
      data: aviso,
      panelClass: ['custom-snackbar']

    });
  }
}
