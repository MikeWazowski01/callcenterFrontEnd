import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../../../core/services/auth.service';
import { LoginService } from '../../../core/services/login/login.service';
import { IMenus } from '../../../shared/models/Menus';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AvisosComponent } from '../../../shared/avisos/avisos.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cambiar-password',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    CommonModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule
  ],
  templateUrl: './cambiar-password.component.html',
  styleUrl: './cambiar-password.component.css'
})
export class CambiarPasswordComponent implements OnInit {
  UpdatePasswordForm: FormGroup;
  isApiLoading: boolean = false;
  logo: string = 'img/logo_login.png';
  durationInSeconds = 5;
  data: any;

  private _snackBar = inject(MatSnackBar);

  constructor(
    private authService: AuthService,
    private loginService: LoginService,
    private router: Router,
    private fb: FormBuilder,
    private jwtHelper: JwtHelperService) {
    // Recuperamos la navegación actual
    const navegacion = this.router.getCurrentNavigation();
    // Extraemos el state de forma segura
    this.data = navegacion?.extras.state;

    this.UpdatePasswordForm = this.fb.group({
      usuario: [this.data.usuario],
      passwordAnterior: ['', [Validators.required]],
      passwordNuevo: ['', Validators.required],
      passwordValidar: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  CambiarPassword() {

    this.isApiLoading = true;
    this.loginService.HttpPost('Administrador/updatepassword-usuario', {}, this.UpdatePasswordForm.value).subscribe({
      next: (response) => {


        this.openSnackBar("Inicie session con su nuevo password");


        this.isApiLoading = false;
        this.router.navigate(['/login']);
      },
      error: (error: HttpErrorResponse) => {

        if (error.status == 0) {

          this.isApiLoading = false;

          this.openSnackBar("Revisa tu conexión a internet :(");

        }
        else if (error.status == 400) {
          if (error.error.codigo == 'PASSWORD_INCORRECT' || error.error.codigo == 'PASSWORD_EQUAL' || error.error.codigo == 'PASSWORD_USER')
            this.openSnackBar(error.error.mensaje);
          else {
            this.openSnackBar(error.error.errors?.passwordNuevo);
            this.openSnackBar(error.error.errors?.passwordValidar);
          }

          //  this.openSnackBar('Verifique que los datos sean correctos en caso contrario,comunique al administrador');
          this.isApiLoading = false;
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
