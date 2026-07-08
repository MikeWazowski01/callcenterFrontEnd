import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ToolbarComponent } from "../../../../shared/components/toolbar/toolbar.component";
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { IOficinas } from '../../../../shared/models/Catalogos';
import { GenericService } from '../../../../core/services/generic.service';
import { Pagination, ResponseData } from '../../../../shared/models/response-data.model';
import { IClientes } from '../../../../shared/models/Clientes';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AvisosComponent } from '../../../../shared/avisos/avisos.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-buscar-cliente',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatDividerModule,
    MatTabsModule,
    MatToolbarModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    ToolbarComponent,
    MatTableModule,
    MatPaginatorModule,
    CommonModule,
    MatProgressSpinnerModule],
  templateUrl: './buscar-cliente.component.html',
  styleUrl: './buscar-cliente.component.css'
})
export class BuscarClienteComponent implements OnInit {
  titulo = 'Buscar Cliente';
  filtroForm!: FormGroup;
  CataOficinas: IOficinas[] = [];
  //Paginacion
  length = 50;
  pageSize = 50;
  pageIndex = 0;
  pageSizeOptions = [50, 100, 200];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  isLoading: boolean = false;
  clickbuscar: boolean = false;
  isLoadigbuscarLimpiar: boolean = false;

  readonly panelOpenState = signal(false);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatExpansionPanel) panel!: MatExpansionPanel;
  pageEvent: PageEvent = { pageIndex: 0, pageSize: 50, length: 0 };
  durationInSeconds = 5;
  private _snackBar = inject(MatSnackBar);
  displayedColumns: string[] = ['acciones', 'noCliente', 'cliente', 'grupo', 'surcursal', 'curp', 'fechaNacimiento', 'ine'];
  dataSource: MatTableDataSource<IClientes> = new MatTableDataSource();

  constructor(private dialog: MatDialogRef<BuscarClienteComponent>, private fb: FormBuilder, private methodsService: GenericService, private router: Router, private servicio: AuthService) {
    this.filtroForm = this.fb.group({
      GFCLINO1: [''],
      GFCLIAP1: [''],
      GFCLIAP2: [''],
      GFCLICUR: [''],
      GFCLICAG: [null],
    });
  }

  ngOnInit(): void {
    this.cargarCatalogos();
  }

  cargarCatalogos() {

    setTimeout(() => {
      this.methodsService.HttpGet('Oficinas/get-oficinas', {}).subscribe({
        next: (response: ResponseData<IOficinas[]>) => {
          this.CataOficinas = response.data;
        }, error: () => {

        }
      });

    }, 1000);

  }

  seguimientoNuevo() {
  }

  buscar() {
    this.dataSource.data = [];
    this.pageIndex = 0;
    this.pageSize = 50;
    this.getClientes(this.pageIndex, this.pageSize);
  }

  clearTable() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.renderRows();
  }
  limpiarFormualrio() {
    this.isLoadigbuscarLimpiar = true;
    this.filtroForm.reset({
      GFCLINO1: '',
      GFCLIAP1: '',
      GFCLIAP2: '',
      GFCLICUR: '',
      GFCLICAG: null,
      pageNumber: 1,
      pageSize: 50
    });
    this.resetPaginacion(50);
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

    this.getClientes(this.pageIndex, this.pageSize);
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

  getClientes(pageNumber: number, pageSize: number) {

    this.isLoading = true;
    const filtros = this.filtroForm.value;

    const params = {
      PageNumber: pageNumber + 1,
      PageSize: pageSize,
      GFCLINO1: filtros.GFCLINO1,
      GFCLIAP1: filtros.GFCLIAP1,
      GFCLIAP2: filtros.GFCLIAP2,
      GFCLICUR: filtros.GFCLICUR,
      GFCLICAG: filtros.GFCLICAG == null ? '' : filtros.GFCLICAG
    };


    setTimeout(() => {
      this.methodsService.HttpPost('Clientes/get-clientes', {}, params).subscribe((response: Pagination<IClientes[]>) => {

        this.dataSource.data = response.elements;
        this.length = response.totalRecords;
        if (this.dataSource.data.length <= 0) {
          this.clickbuscar = true;
          this.openSnackBar('No se encontraron resultados para la búsqueda.');
        } else {
          this.clickbuscar = false;
        }
        this.isLoading = false;
      }, error => {
        if (error.status === 401) {
          this.openSnackBar('Tu sesión expiró. Vuelve a iniciar sesión para continuar.');
          this.servicio.logout();
        }

        this.isLoading = false;
      });

    }, 500);
  }

  seleccionarCliente(dato: any) {

    if (dato.INCIDENCIA)
      this.openSnackBar('El cliente ya cuenta con una Incidencia pendiente.');
    else
      this.dialog.close(dato);
  }

  openSnackBar(aviso: string) {

    this._snackBar.openFromComponent(AvisosComponent, {
      duration: this.durationInSeconds * 1000,
      data: aviso,
      panelClass: ['custom-snackbar']
    });
  }

  closeDialog() {
    if (!this.clickbuscar)
      this.dialog.close('close');
    else
      this.dialog.close(this.dataSource.data);
  }
}
