import { ChangeDetectorRef, Component, inject, NgZone, OnInit, signal, ViewChild, viewChild } from '@angular/core';
import { MatAccordion, MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormBuilder, FormControl, FormGroup, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { IncidenciaNuevaComponent } from './incidencia-nueva/incidencia-nueva.component';
import { CommonModule } from '@angular/common';
import { GenericService } from '../../../core/services/generic.service';
import { Pagination, ResponseData } from '../../../shared/models/response-data.model';
import { IEstatusResponse, IPrioridadResponse } from '../../../shared/models/Catalogos';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { finalize, Observable } from 'rxjs';
import { IIncidencia } from '../../../shared/models/Incidencia';
import { DetalleIncidenciaComponent } from './detalle-incidencia/detalle-incidencia.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AvisosComponent } from '../../../shared/avisos/avisos.component';
import { EditarIncidenciaComponent } from './editar-incidencia/editar-incidencia.component';
import { PermisosService } from '../../../core/services/permisos.service';
import { PermisosEnum } from '../../../shared/Enum/PermisosEnum';
import { ConfirmarComponent } from '../../../shared/confirmar/confirmar.component';
import { HasPermissionDirective } from '../../../shared/directives/has-permission.directive';

@Component({
  selector: 'app-incidencias',
  standalone: true,
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'es-MX' }],
  imports: [MatButtonModule,
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
    MatInputModule,
    MatPaginatorModule,
    MatDatepickerModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    HasPermissionDirective],
  templateUrl: './incidencias.component.html',
  styleUrl: './incidencias.component.css'
})

export class IncidenciasComponent implements OnInit {

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
  Prioridades: IPrioridadResponse[] = [];
  Estatus: IEstatusResponse[] = [];
  Incidencias: IIncidencia[] = [];
  estatusControl = new FormControl();
  estatus: any[] = [];
  filteredOptions!: Observable<any[]>;

  //Tiempo de Alertar 
  durationInSeconds = 5;
  private _snackBar = inject(MatSnackBar);


  step = signal(0);
  panelOpenState = signal(false);
  filtroForm!: FormGroup;
  displayedColumns: string[] = ['acciones', 'folio', 'persona', 'fechaInicio', 'fechaFin', 'da', 'responsable', 'categoria', 'prioridad', 'estatus'];
  dataSource: MatTableDataSource<IIncidencia> = new MatTableDataSource();
  //Permisis
  canSee: boolean = false;
  canAdd: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  canDetalle: boolean = false;
  pageEvent: PageEvent = { pageIndex: 0, pageSize: 50, length: 0 };

  constructor(private dialog: MatDialog,
    private fb: FormBuilder,
    private methodsService: GenericService,
    private cdr: ChangeDetectorRef,
    private permisosService: PermisosService,
    private cd: ChangeDetectorRef,
    private zone: NgZone) {
    this.filtroForm = this.fb.group({
      nombre: [''],
      apellidoPaterno: [''],
      apellidoMaterno: [''],
      fechaInicio: [null],
      prioridad: [0],
      sucursal: [0],
      estatus: [0]
    });

  }

  ngOnInit(): void {

    this.canSee = this.permisosService.hasPermission('Incidencia', PermisosEnum.Ver);
    this.canAdd = this.permisosService.hasPermission('Incidencia', PermisosEnum.Crear);
    this.canEdit = this.permisosService.hasPermission('Incidencia', PermisosEnum.Editar);
    this.canDelete = this.permisosService.hasPermission('Incidencia', PermisosEnum.Eliminar);
    this.canDetalle = this.permisosService.hasPermission('Incidencia', PermisosEnum.Detalles);
    this.getIncidencias(this.pageIndex, this.pageSize);
    this.cargarCatalogos();
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

    this.getIncidencias(this.pageIndex, this.pageSize);
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  getIncidencias(pageNumber: number, pageSize: number) {

    this.isLoading = true;
    const filtros = this.filtroForm.value;

    const params = {
      PageNumber: pageNumber + 1,
      PageSize: pageSize,
      Nombre: filtros.nombre,
      ApellidoPaterno: filtros.apellidoPaterno,
      ApellidoMaterno: filtros.apellidoMaterno,
      FechaInicio: filtros.fechaInicio,
      Prioridad: filtros.prioridad,
      Sucursal: filtros.sucursal,
      Estatus: filtros.estatus
    };

    this.methodsService.HttpPost('Incidencia/get-incidencia', {}, params)
      .subscribe({
        next: (response: Pagination<IIncidencia[]>) => {


          this.dataSource.data = response.elements;
          this.length = response.totalRecords;

          if (!response.elements?.length) {
            this.openSnackBar('No se encontraron registros.');
          }

          this.isLoading = false;
        },
        error: (error) => {
          this.openSnackBar(error.error.message);
          this.isLoading = false;
        }
      });

  }

  nuevaIncidencia() {
    const dialogRef = this.dialog.open(IncidenciaNuevaComponent, {
      autoFocus: false,
      minWidth: '95%',
      minHeight: '98%',
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {

      this.resetPaginacion(50);
      this.getIncidencias(this.pageIndex, this.pageSize);
      if (result === 'success') {
      }
    });
  }

  resetFilter(): void {
    this.filtroForm.reset();
  }

  cargarCatalogos() {
    setTimeout(() => {
      this.methodsService.HttpGet('Estatus/get-estatus', {}).subscribe({
        next: (response: ResponseData<IEstatusResponse[]>) => {
          this.Estatus = response.data;

        }, error: () => {
        }
      });

      this.methodsService.HttpGet('Prioridad/get-prioridad', {}).subscribe({
        next: (response: ResponseData<IPrioridadResponse[]>) => {
          this.Prioridades = response.data;
        }, error: () => {

        }
      });
    }, 1000);

  }

  filtrar(filtro: string): any[] {
    const valor = filtro.toLowerCase();
    return this.estatus.filter(option =>
      option.codigo.toLowerCase().includes(valor)
    );
  }

  displayFn(opcion: any): string {
    return opcion?.codigo || '';
  }



  verDetalles(data: any) {
    if (data.IdIncidencia > 0) {
      const dialogRef = this.dialog.open(DetalleIncidenciaComponent, {
        data: { Incidencia: data, Folio: data.Folio },
        autoFocus: false,
        minWidth: '50%',
        maxHeight: '500px',
        disableClose: true,
        panelClass: 'custom-dialog-container'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'success' || result === 'data null') {

        }
      });
    } else {
      this.openSnackBar(`El No. de Folio: ${data.Folio} no tiene detalle.`);
    }

  }

  datosIncidencias(data: any) {


    const dialogRef = this.dialog.open(EditarIncidenciaComponent, {
      data: { dataIncidencia: data, dataPrioridad: this.Prioridades, dataEstatus: this.Estatus },
      autoFocus: false,
      minWidth: '98%',
      width: '90%',
      height: 'auto',
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result === 'success' || result === 'data null') {
        this.resetPaginacion(50);
        this.getIncidencias(this.pageIndex, this.pageSize);

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
    this.getIncidencias(this.pageIndex, this.pageSize);
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
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      fechaInicio: null,
      prioridad: 0,
      sucursal: 0,
      estatus: 0,
      pageNumber: 1,
      pageSize: 50
    });
    this.resetPaginacion(50);
    this.getIncidencias(this.pageIndex, this.pageSize);
  }

  eliminarIncidencia(data: any) {
    const dialogRef = this.dialog.open(ConfirmarComponent, {
      data: { title: 'Eliminar Incidencia', message: '¿Deseas Eliminar la Incidencia?', confirm: 'Si', cancel: 'No' },
      autoFocus: false,
      minWidth: '100px',
      width: '30%',
      height: '20%',
      disableClose: true,
      panelClass: 'custom-dialog-container-aviso'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.methodsService.HttpPut('Incidencia/delete-incidencia', { IdIncidencia: data.IdIncidencia }, {}).subscribe({
          next: (response) => {
            this.limpiarFormualrio();
            this.openSnackBar("La incidencia fue eliminada Exitosamente!!..");
          },
          error: (error) => {
            if (error.status === 401) {
              this.openSnackBar("No autorizado. Por favor, inicia sesión.");
            } else {
              this.openSnackBar("Error: " + (error.error.message || "Error desconocido"));
            }
          }
        });

      }
    });

  }
}
