import { Component, Inject, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ToolbarComponent } from '../../../../shared/components/toolbar/toolbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AvisosComponent } from '../../../../shared/avisos/avisos.component';

@Component({
  selector: 'app-verificacion',
  providers: [DatePipe],
  standalone: true,
  imports: [MatIconModule, MatToolbarModule, MatInputModule, MatButtonModule, ReactiveFormsModule, CommonModule, ToolbarComponent],
  templateUrl: './verificacion.component.html',
  styleUrl: './verificacion.component.css'
})
export class VerificacionComponent implements OnInit {

  titulo: string = 'Nueva Verificación';
  fechaInicio: Date = new Date();
  fechaFin: Date = new Date();
  readOnly = true;
  durationInSeconds = 5;
  //fechaFin = new Date().getDate() + 3;
  private _snackBar = inject(MatSnackBar);

  title: string = 'Nueva Verificación';
  verificacionForm!: FormGroup;
  constructor(
    private datePipe: DatePipe,
    private dialog: MatDialogRef<VerificacionComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.verificacionForm = this.fb.group({
      FechaInicio: [null],
      FechaFin: [null],
      Descripcion: ['', Validators.required],
    });
  }

  ngOnInit(): void {

    /* const fecha = new Date();
     const fechaFinDate = new Date();
     fechaFinDate.setDate(fechaFinDate.getDate() + 2);
     this.fechaFin = this.fechaFin;s
 */
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 2);

    this.verificacionForm.patchValue({
      FechaInicio: new Date().toISOString().slice(0, 16),// this.datePipe.transform(fecha, 'dd/MM/yyyy'),
      FechaFin: fecha.toISOString().slice(0, 16)//this.datePipe.transform(fechaFinDate, 'dd/MM/yyyy')
    });
  }

  guardar() {
    const descripcion = this.verificacionForm.get('Descripcion')?.value;

    if (descripcion != '')
      this.dialog.close(this.verificacionForm.value);
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
