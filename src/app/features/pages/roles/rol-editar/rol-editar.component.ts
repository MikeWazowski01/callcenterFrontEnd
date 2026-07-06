import { DATA } from './../../../../shared/models/data';
import { Component, inject, Inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ToolbarComponent } from '../../../../shared/components/toolbar/toolbar.component';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmarComponent } from '../../../../shared/confirmar/confirmar.component';
import { GenericService } from '../../../../core/services/generic.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AvisosComponent } from '../../../../shared/avisos/avisos.component';

@Component({
  selector: 'app-rol-editar',
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'es-MX' }],
  imports: [
    MatTabsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    ToolbarComponent,
    MatSelectModule,
    MatDatepickerModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './rol-editar.component.html',
  styleUrl: './rol-editar.component.css'
})
export class RolEditarComponent {
  filtroForm!: FormGroup;
  guardarRol() {
    this.dialog.close('close');
  }
  titulo: string = 'Editar Rol';
  incidencia: string = '';
  folio: string = '';
  private _snackBar = inject(MatSnackBar);
  durationInSeconds = 5;
  isLoadingSave: boolean = false;

  constructor(private fb: FormBuilder, private dialog: MatDialogRef<RolEditarComponent>,
    private dialogGeneral: MatDialog, @Inject(MAT_DIALOG_DATA) private data: any,
    private methodsService: GenericService) {
    this.filtroForm = this.fb.group({
      IdRol: [0],
      NombreRol: [''],
      FechaRegistro: [null],
      EstatusNombre: [''],
      Estatus: [null]
    });
  }
  ngOnInit(): void {

    this.cargarDatosForm();
    this.incidencia = this.data.incidencia;
    this.folio = this.data.Folio
  }

  cargarDatosForm() {

    this.filtroForm.setValue({
      IdRol: this.data.dataIncidencia.IdRol,
      NombreRol: this.data.dataIncidencia.NombreRol,
      FechaRegistro: this.data.dataIncidencia.FechaRegistro,
      EstatusNombre: '',
      Estatus: this.data.dataIncidencia.Estatus
    });
  }

  editarRole() {
    this.isLoadingSave = true;
    this.openSnackBar("Actulizando rol espere por favor....... ");
    this.methodsService.HttpPost('Roles/update-roles', {}, this.filtroForm.value).subscribe({
      next: (response) => {
        this.isLoadingSave = false;
        this.openSnackBar("El rol se actualizo con exito....... ");

        this.closeDialogEditar();
      },
      error: (error) => {
        this.isLoadingSave = false;
        if (error.status === 401) {
          this.openSnackBar("No autorizado. Por favor, inicia sesión.");
          // Aquí puedes redirigir al login o hacer otra acción
        } else {
          // Mensaje genérico para otros errores
          this.openSnackBar("Error: " + (error.error.message || "Error desconocido"));
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
  closeDialog() {
    const dialogRef = this.dialogGeneral.open(ConfirmarComponent, {
      data: { title: 'Salir sin guardar', message: 'No has guardado los cambios. ¿Deseas salir de todas formas?', confirm: 'Si', cancel: 'No' },
      autoFocus: false,
      minWidth: '100px',
      width: '30%',
      height: '20%',
      disableClose: true,
      panelClass: 'custom-dialog-container-aviso'
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.dialog.close('close');
      }
    });

  }


  closeDialogEditar() {
    this.dialog.close('success');
  }
}
