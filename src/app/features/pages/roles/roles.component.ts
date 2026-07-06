import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { GenericService } from '../../../core/services/generic.service';
import { Pagination, ResponseData } from '../../../shared/models/response-data.model';
import { AvisosComponent } from '../../../shared/avisos/avisos.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { RolNuevoComponent } from './rol-nuevo/rol-nuevo.component';
import { RolEditarComponent } from './rol-editar/rol-editar.component';
import { IRoles } from '../../../shared/models/Roles';;

@Component({
  selector: 'app-roles',
  standalone: true,
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'es-MX' }],
  imports: [
    MatButtonModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatDatepickerModule,
    MatDividerModule,
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    MatDatepickerModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatInputModule
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent {
  @ViewChild(MatExpansionPanel) panel!: MatExpansionPanel;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  //Variables
  route: string = 'Prioridad';
  isLoading: boolean = false;
  isLoadigbuscarLimpiar: boolean = false;

  //Paginacion
  length = 50;
  pageSize = 50;
  pageIndex = 0;
  pageSizeOptions = [50, 100, 200];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;


  //Areglos
  Roles: IRoles[] = [];
  filteredOptions!: Observable<any[]>;

  //Tiempo de Alertar 
  durationInSeconds = 5;
  private _snackBar = inject(MatSnackBar);

  //accordion = viewChild.required(MatAccordion);
  step = signal(0);
  panelOpenState = signal(false);
  filtroForm!: FormGroup;
  displayedColumns: string[] = ['acciones', 'nombreRol', 'fechaRegistro', 'estatus'];
  dataSource: MatTableDataSource<IRoles> = new MatTableDataSource();

  pageEvent: PageEvent = { pageIndex: 0, pageSize: 50, length: 0 };




  //filteredItems = [...this.items];
  constructor(private dialog: MatDialog, private fb: FormBuilder, private methodsService: GenericService, private cdr: ChangeDetectorRef) {
    this.filtroForm = this.fb.group({
      NombreRol: [''],
      FechaRegistro: [null],
      Estatus: [null]
    });
  }
  /*
    setStep(index: number) {
      this.step.set(index);
    }
  
    nextStep() {
      this.step.update(i => i + 1);
    }
  
    prevStep() {
      this.step.update(i => i - 1);
    }*/

  ngOnInit(): void {

    // this.cargarDatos();
    // Initialize the form group with form controls for each filter criterion


    this.getRoles(this.pageIndex, this.pageSize);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  handlePageEvent(e: PageEvent) {
    this.isLoadigbuscarLimpiar = false;

    if (this.panelOpenState()) {
      this.panel.close();
      this.panelOpenState.set(false);
    }

    if (this.pageSize != e.pageSize) {
      this.resetPaginacion(e.pageSize);
    } else {
      this.pageEvent = e;
      this.length = e.length;
      this.pageSize = e.pageSize;
      this.pageIndex = e.pageIndex;
    }

    this.getRoles(this.pageIndex, this.pageSize);
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }
  // Subscribe to value changes to perform real-time filtering
  /* this.filtroForm.valueChanges.subscribe(formValues => {
     this.applyFilter(formValues);
   });

   this.filteredOptions = this.myControl.valueChanges.pipe(
     startWith(''),
     map(value => this._filter(value || '')),
   );
 }

 private _filter(value: string): string[] {
   const filterValue = value.toLowerCase();

   return this.options.filter(option => option.toLowerCase().includes(filterValue));
 }
*/
  getRoles(pageNumber: number, pageSize: number) {

    this.isLoading = true;
    const filtros = this.filtroForm.value;

    const params = {
      PageNumber: pageNumber + 1,
      PageSize: pageSize,
      NombreRol: '',//filtros.NombreRol,
      FechaRegistro: filtros.FechaRegistro,
      Estatus: filtros.Estatus,
    };

    setTimeout(() => {
      this.methodsService.HttpPost('Roles/get-roles', {}, params).subscribe((response: Pagination<IRoles[]>) => {
        this.dataSource.data = response.elements;
        this.length = response.totalRecords;
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      });
    }, 500);


  }

  nuevoRol() {

    const dialogRef = this.dialog.open(RolNuevoComponent, {
      autoFocus: false,
      width: '40vw',
      maxWidth: '100vw',
      maxHeight: '100vh',
      disableClose: true,
      panelClass: 'custom-dialog-container-nuevo'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {

      }
    });
  }

  // Method to reset the filter form
  resetFilter(): void {
    this.filtroForm.reset();
  }

  /*
    filtrar(filtro: string): any[] {
      const valor = filtro.toLowerCase();
      return this.estatus.filter(option =>
        option.codigo.toLowerCase().includes(valor)
      );
    }*/
  // Muestra en el input el nombre
  displayFn(opcion: any): string {
    return opcion?.codigo || '';
  }


  rolEditar(data: any) {
    const dialogRef = this.dialog.open(RolEditarComponent, {
      data: { dataIncidencia: data },
      autoFocus: false,
      width: '40vw',
      maxWidth: '100vw',
      maxHeight: '100vh',
      disableClose: true,
      panelClass: 'custom-dialog-container-editar'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success' || result === 'data null') {
        this.resetPaginacion(50);
        this.getRoles(this.pageIndex, this.pageSize);
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

  buscarFiltro() {
    this.isLoadigbuscarLimpiar = true;
    this.resetPaginacion(this.pageSize);
    this.getRoles(this.pageIndex, this.pageSize);
  }

  resetPaginacion(sizePage: number) {
    this.length = 50;
    this.pageSize = sizePage;
    this.pageIndex = 0;

    this.hidePageSize = false;
    this.showPageSizeOptions = true;
    this.showFirstLastButtons = true;
    this.disabled = false;

    this.dataSource.data = [];
  }

  limpiarFormualrio() {
    this.isLoadigbuscarLimpiar = true;
    this.filtroForm.reset({
      Usuario: '',
      NombreUsuario: '',
      FechaRegistro: null,
      Activo: null,
      Email: '',
      pageNumber: 1,
      pageSize: 50
    });
    this.resetPaginacion(50);
    this.getRoles(this.pageIndex, this.pageSize);
  }
}
