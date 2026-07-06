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
    MatSelectModule],
  templateUrl: './nuevo-usuario.component.html',
  styleUrl: './nuevo-usuario.component.css'
})
export class NuevoUsuarioComponent {
  titulo: string = 'Nuevo Usuario';
  readOnly = true;
  filtroForm!: FormGroup;
  fechaInicio = new Date();
  RolesUsuarios: IRolesUsuario[] = [];
  RolesForm!: FormGroup;
  constructor(
    private dialog: MatDialogRef<NuevoUsuarioComponent>,
    private dialogGeneral: MatDialog,
    private fb: FormBuilder,
    private methodsService: GenericService) {
    this.RolesForm = this.fb.group({
      Login: ['', [Validators.required, Validators.minLength(5)]],
      Email: ['', Validators.required],
      Nombre: ['', [Validators.required, Validators.minLength(5)]],
      Rol: [null, Validators.required]
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

  seguimientoNuevo() {

  }
  guardar() {
    throw new Error('Method not implemented.');
  }
  closeDialog() {

    this.dialog.close('close');
  }

}
