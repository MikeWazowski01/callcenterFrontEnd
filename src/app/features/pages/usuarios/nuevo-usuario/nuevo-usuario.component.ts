import { CommonModule } from '@angular/common';
import { Component, computed, inject, model, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ToolbarComponent } from '../../../../shared/components/toolbar/toolbar.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { GenericService } from '../../../../core/services/generic.service';
import { IRolesUsuario } from '../../../../shared/models/Catalogos';
import { ResponseData } from '../../../../shared/models/response-data.model';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AvisosComponent } from '../../../../shared/avisos/avisos.component';

@Component({
  selector: 'app-nuevo-usuario',
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
  MatProgressSpinnerModule],
  templateUrl: './nuevo-usuario.component.html',
  styleUrl: './nuevo-usuario.component.css'
})
export class NuevoUsuarioComponent {
  titulo: string = 'Nuevo Usuario';
  readOnly = true;
   durationInSeconds = 5;
  filtroForm!: FormGroup;
  fechaInicio = new Date();
  RolesUsuarios: IRolesUsuario[] = [];
  RolesForm!: FormGroup;
  isLoadingSave: boolean = false;
  guardando: boolean = false;
    private _snackBar = inject(MatSnackBar);
  constructor(
    private dialog: MatDialogRef<NuevoUsuarioComponent>,
    private dialogGeneral: MatDialog,
    private fb: FormBuilder,
    private methodsService: GenericService) {
    this.RolesForm = this.fb.group({
      Usuario: ['', [Validators.required, Validators.minLength(5)]],
      Email: ['', Validators.required],
      NombreUsuario: ['', [Validators.required, Validators.minLength(5)]],
      IdRol: [null, Validators.required],
      Activo:[true],
      Password:[null,Validators.required],
      IdUsuario:[0]
    });
  }

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentFruit = model('');
  readonly fruits = signal(['Lemon']);
  readonly allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  readonly filteredFruits = computed(() => {
    const currentFruit = this.currentFruit().toLowerCase();
    return currentFruit
      ? this.allFruits.filter(fruit => fruit.toLowerCase().includes(currentFruit))
      : this.allFruits.slice();
  });

  readonly announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.update(fruits => [...fruits, value]);
    }

    // Clear the input value
    this.currentFruit.set('');
  }

  remove(fruit: string): void {
    this.fruits.update(fruits => {
      const index = fruits.indexOf(fruit);
      if (index < 0) {
        return fruits;
      }

      fruits.splice(index, 1);
      this.announcer.announce(`Removed ${fruit}`);
      return [...fruits];
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.update(fruits => [...fruits, event.option.viewValue]);
    this.currentFruit.set('');
    event.option.deselect();
  }
  /** */

  ngOnInit(): void {

    this.cargarCatalogos();
  }

  cargarCatalogos() {
    this.methodsService.HttpGet('Usuarios/get-roles-usuarios', {}).subscribe({
      next: (response: ResponseData<IRolesUsuario[]>) => {
        this.RolesUsuarios = response.data;

        //this.isLoading = false;
      }, error: () => {
        //this.isLoading = false;
      }
    });
  }


  guardar() {
 
    console.log('entro')
    console.log(this.RolesForm);
     this.methodsService.HttpPost('Administrador/register-usuario', {}, this.RolesForm.value).subscribe({
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
  closeDialog() {

    this.dialog.close('close');
  }

   openSnackBar(aviso: string) {
  
      this._snackBar.openFromComponent(AvisosComponent, {
  
        duration: this.durationInSeconds * 1000,
        data: aviso,
        panelClass: ['custom-snackbar']
  
      });
    }

}
