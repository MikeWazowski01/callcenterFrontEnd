import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ToolbarComponent } from '../../../../shared/components/toolbar/toolbar.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { AvisosComponent } from '../../../../shared/avisos/avisos.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenericService } from '../../../../core/services/generic.service';
import { IRolesUsuario } from '../../../../shared/models/Catalogos';
import { ResponseData } from '../../../../shared/models/response-data.model';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [
     MatIconModule,
    MatToolbarModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    ToolbarComponent,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatChipsModule,
    FormsModule,
    MatSelectModule,
  MatProgressSpinnerModule,
  MatCheckboxModule
  ],
  templateUrl: './editar-usuario.component.html',
  styleUrl: './editar-usuario.component.css'
})
export class EditarUsuarioComponent  implements OnInit {
 RolesForm!: FormGroup;
 titulo: string = 'Editar Usuario';
  isLoadingSave: boolean = false;
  durationInSeconds = 5;
   private _snackBar = inject(MatSnackBar);
   RolesUsuarios: IRolesUsuario[] = [];
  constructor(
    private dialog: MatDialogRef<EditarUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
     private methodsService: GenericService,
    private fb: FormBuilder
  ){ 
    this.RolesForm = this.fb.group({
      Usuario: ['', [Validators.required, Validators.minLength(5)]],
      Email: ['', Validators.required],
      NombreUsuario: ['', [Validators.required, Validators.minLength(5)]],
      IdRol: [0, Validators.required],
      Activo:[true],
      Password:['',Validators.required],
      IdUsuario:[0]
    });
   }

   ngOnInit(): void {
this.cargarCatalogos();
      
   }

    cargarCatalogos() {
      console.log('catralogo')
  
       this.methodsService.HttpGet('Usuarios/get-roles-usuarios', {}).subscribe({
         next: (response: ResponseData<IRolesUsuario[]>) => {
           this.RolesUsuarios = response.data;
   console.log(response)
   this.cargarDatos();
 
           //this.isLoading = false;
         }, error: () => {
           //this.isLoading = false;
         }
       });

     }

   cargarDatos(){
    console.log(this.RolesUsuarios)
this.RolesForm.patchValue({
        Usuario: this.data.data.Usuario,
        Email:this.data.data.Email,
        NombreUsuario:this.data.data.NombreUsuario,
        IdRol:this.data.data.IdRol,
        Activo:this.data.data.Estatus == 'ACTIVO' ? true : false ,
        IdUsuario:this.data.data.IdUsuario      
      });
//this.RolesForm.setValue(this.data.data.IdRol);
     // this.RolesForm.setValue("IdRol").value = this.data.data.IdRol;
   }

   guardar() {
    console.log('entro')
    console.log(this.RolesForm);
     this.methodsService.HttpPost('Administrador/editar-usuario', {}, this.RolesForm.value).subscribe({
      next: (response) => {
console.log(response)
        this.isLoadingSave = false;
        this.openSnackBar("El usuario se registro con exito....... ");

        this.closeDialog();
      },
      error: (error) => {
        console.log(error)
        this.isLoadingSave = false;
        if (error.status === 401) {
          this.openSnackBar("No autorizado. Por favor, inicia sesión.");
          // Aquí puedes redirigir al login o hacer otra acción
        } else {
          // Mensaje genérico para otros errores

          this.openSnackBar("Error: " + (error.error.message || "Error desconocido"));
         // this.openSnackBar("La Vista se cerrara por posibles errores verique que el usuario no fue creado. ");

          this.closeDialog();
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

    this.dialog.close('close');
  }
}
