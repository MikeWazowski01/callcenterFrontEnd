import { ITipoSeguimientoResponse } from './../../../../shared/models/Catalogos';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from "../../../../shared/components/toolbar/toolbar.component";
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AvisosComponent } from '../../../../shared/avisos/avisos.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-seguimiento',
  standalone: true,
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'es-MX' }],
  imports: [
    MatCheckboxModule,
    MatIconModule,
    MatToolbarModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    ToolbarComponent,
    MatSelectModule],
  templateUrl: './seguimiento.component.html',
  styleUrl: './seguimiento.component.css'
})
export class SeguimientoComponent implements OnInit {

  titulo: string = 'Nuevo Seguimiento';
  readOnly = true;
  seguimientoForm!: FormGroup;
  FechaHora = new Date();
  TiposSeguimientos: ITipoSeguimientoResponse[] = [];
  private _snackBar = inject(MatSnackBar);
  durationInSeconds = 5;
  constructor(
    private dialog: MatDialogRef<SeguimientoComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {

    const hoy = new Date();
    const dia = hoy.getDate().toString().padStart(2, '0');
    const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
    const anio = hoy.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${anio}`;


    this.seguimientoForm = this.fb.group({
      Descripcion: ['', Validators.required],
      FechaCreacion: [fechaFormateada]
    });
  }


  ngOnInit(): void {
    this.TiposSeguimientos = this.data.data;
  }



  seguimientoNuevo() {

  }
  guardar() {


    const descripcion = this.seguimientoForm.get('Descripcion')?.value;
    const fecha = this.seguimientoForm.get('FechaCreacion')?.value;

    if (descripcion != '')
      this.dialog.close(this.seguimientoForm.value);
    else
      this.openSnackBar("Datos Obligatorios Revise (*)");
  }

  openSnackBar(aviso: string) {

    this._snackBar.openFromComponent(AvisosComponent, {

      duration: this.durationInSeconds * 1000,
      data: aviso,
      panelClass: ['custom-snackbar']

    });
  }
  closeDialog() {
    this.dialog.close('close');
  }

}
