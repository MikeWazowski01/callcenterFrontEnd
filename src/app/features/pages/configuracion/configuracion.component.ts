import { CommonModule } from '@angular/common';
import { Component, computed, inject, model, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ToolbarComponent } from '../../../shared/components/toolbar/toolbar.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { IRolesUsuario } from '../../../shared/models/Catalogos';
import { MatDialogRef } from '@angular/material/dialog';
import { GenericService } from '../../../core/services/generic.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ResponseData } from '../../../shared/models/response-data.model';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource } from '@angular/material/table';
import { IArchivoModel } from '../../../shared/models/Archivos';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-configuracion',
  imports: [MatIconModule,
    MatToolbarModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatChipsModule,
    FormsModule,
    MatSelectModule,
    MatCardModule, MatChipsModule],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.css'
})
export class ConfiguracionComponent {
  titulo: string = 'Nuevo Usuario';
  readOnly = true;
  sinPerfil: boolean = true;
  avatarImg!: IArchivoModel;
  RolesUsuarios: IRolesUsuario[] = [];
  configuracionForms!: FormGroup;
  readonly: boolean = true;
  safeUrl!: SafeResourceUrl;
  urlAvatar: string = 'http://core-dev.grupoconserva.mx/callcenter/avatar/avatar.jpg';//'/avatar/avatar.jpg';


  constructor(
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private methodsService: GenericService) {
    this.configuracionForms = this.fb.group({
      Login: ['', [Validators.minLength(5)]],
      Email: ['', Validators.required],
      Nombre: ['', [Validators.required]],
      Password: ['']
    });
  }


  ngOnInit(): void {
    this.cargarPerfil();
  }
  cargarPerfil() {

    this.methodsService.HttpGet('Usuarios/get-usuariosbyId', {}).subscribe({
      next: (response) => {

        if (response.avatarImg != null) {
          this.sinPerfil = false;
        }

        else {
          this.sinPerfil = true;
        }
        this.configuracionForms.patchValue({
          Login: response[0].Usuario,
          Email: response[0].Email,
          Nombre: response[0].NombreUsuario
        });
      },
      error: (error) => {

      }
    });

    /*this.incidenciaForm.patchValue({
      DatosIncidencia: {
        FechaInicio: this.FechaHora[0].fechaInicio,
        HoraInicio: this.FechaHora[0].horaInicio,
        FechaFin: this.FechaHora[0].fechaFin,
        HoraFin: this.FechaHora[0].horaFin
      }

    });*/
  }



  guardar() {
    throw new Error('Method not implemented.');
  }

  onFileSelected(event: any) {

    const file: File = event.target.files[0];
    if (!file) return;

    var avatar = {
      IdArchivo: 0,
      NombreArchivo: file.name,
      Tipo: file.type,
      Archivo: file,
      Url: URL.createObjectURL(file),
      FechaSubida: new Date(),
      base64: '',
      Activo: true
    }
    this.avatarImg = avatar;

    this.sinPerfil = false;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.avatarImg.Url);

  }



}
