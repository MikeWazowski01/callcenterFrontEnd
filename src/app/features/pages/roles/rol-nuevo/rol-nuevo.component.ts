import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Component, computed, Inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ToolbarComponent } from '../../../../shared/components/toolbar/toolbar.component';
import { FormsModule } from "@angular/forms";
import { ConfirmarComponent } from '../../../../shared/confirmar/confirmar.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ResponseData } from '../../../../shared/models/response-data.model';
import { GenericService } from '../../../../core/services/generic.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IRolMenus } from '../../../../shared/models/Roles';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';

export interface Task {
  name: string;
  completed: boolean;
  subtasks?: Task[];
}

@Component({
  selector: 'app-rol-nuevo',
  standalone: true,
  imports: [
    MatTableModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    ToolbarComponent,
    FormsModule,
    MatDialogModule,
    MatCheckboxModule,
  ],
  templateUrl: './rol-nuevo.component.html',
  styleUrl: './rol-nuevo.component.css'
})
export class RolNuevoComponent implements OnInit {
  Menus: IRolMenus[] = [];
  isLoadingSave = false;

  titulo: string = 'Nuevo Rol';
  rol: string = '';
  isChecked = true;


  readonly task = signal<Task>({
    name: 'Parent task',
    completed: false,
    subtasks: [
      { name: 'Child task 1', completed: false },
      { name: 'Child task 2', completed: false },
      { name: 'Child task 3', completed: false },
    ],
  });
  constructor(
    private dialogRef: MatDialogRef<RolNuevoComponent>,
    private dialogGeneral: MatDialog,
    private methodsServices: GenericService) {

  }

  readonly partiallyComplete = computed(() => {
    const task = this.task();
    if (!task.subtasks) {
      return false;
    }
    return task.subtasks.some(t => t.completed) && !task.subtasks.every(t => t.completed);
  });

  update(completed: boolean, index?: number) {
    this.task.update(task => {
      if (index === undefined) {
        task.completed = completed;
        task.subtasks?.forEach(t => (t.completed = completed));
      } else {
        task.subtasks![index].completed = completed;
        task.completed = task.subtasks?.every(t => t.completed) ?? true;
      }
      return { ...task };
    });
  }






  ngOnInit(): void {
    this.cargarCatalogos();
  }

  cargarCatalogos() {

    this.methodsServices.HttpGet('Menu/get-rol-menu', {}).subscribe({
      next: (response: ResponseData<IRolMenus[]>) => {
        this.Menus = response.data;

        //this.isLoading = false;
      }, error: () => {
        //this.isLoading = false;
      }
    });

  }

  guardarRol() {

  }

  closeDialog() {

    if (this.rol != '') {

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

        if (result == true) {
          this.dialogRef.close('close');
        }
      });

    } else {
      this.dialogRef.close('close');
    }

  }

}
