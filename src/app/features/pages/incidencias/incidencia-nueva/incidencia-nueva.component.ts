import { Component, inject, Inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BuscarClienteComponent } from '../buscar-cliente/buscar-cliente.component';
import { SeguimientoComponent } from '../seguimiento/seguimiento.component';
import { VerificacionComponent } from '../verificacion/verificacion.component';
import { ToolbarComponent } from '../../../../shared/components/toolbar/toolbar.component';
import { IAgentesAsignadosResponse, IAgentesResponse, ICasoCategoriaResponse, ICategoriasResponse, IEstados, IEstatusResponse, IFechaHora, IHomologacionResponse, ILlamadaCategoriaResponse, ILocalidades, IMunicipios, IPais, IPrioridadResponse, IResponsablesResponse, ITipoEnvioEmailResponse, ITipoHomologacionResponse, ITipoMotivoAtrasoResponse, ITipoSeguimientoResponse } from '../../../../shared/models/Catalogos';
import { IIncidencia } from '../../../../shared/models/Incidencia';
import { GenericService } from '../../../../core/services/generic.service';
import { ResponseData } from '../../../../shared/models/response-data.model';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { IResponsables } from '../../../../shared/models/Responsable';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ISeguimiento } from '../../../../shared/models/Seguimiento';
import { IArchivoModel } from '../../../../shared/models/Archivos';
import { AuthService } from '../../../../core/services/auth.service';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { BehaviorSubject, combineLatest, map, Observable, of, startWith } from 'rxjs';
import { IRegistrarIncidencia } from '../../../../shared/models/RegistrarIncidencia';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AvisosComponent } from '../../../../shared/avisos/avisos.component';
import { VisorArchivoComponent } from '../../../../shared/visor-archivo/visor-archivo.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IVerificacion } from '../../../../shared/models/Verficiacion';
import { PermisosService } from '../../../../core/services/permisos.service';
import { PermisosEnum } from '../../../../shared/Enum/PermisosEnum';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';


@Component({
  selector: 'app-incidencia-nueva',
  standalone: true,
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'es-MX' }, DatePipe, CurrencyPipe],
  imports: [MatExpansionModule, MatDividerModule, MatTabsModule, MatToolbarModule, MatDialogModule, MatFormFieldModule, ReactiveFormsModule, MatDatepickerModule, MatSelectModule,
    MatIconModule, MatCardModule, MatInputModule, MatCheckboxModule, ToolbarComponent, CommonModule,
    MatTableModule, MatAutocompleteModule, MatNativeDateModule, MatProgressSpinnerModule, HasPermissionDirective],
  templateUrl: './incidencia-nueva.component.html',
  styleUrl: './incidencia-nueva.component.css'
})
export class IncidenciaNuevaComponent implements OnInit {

  titulo: string = 'Nueva Incidencia';
  localidadCtrl = new FormControl<ILocalidades | null>(null);
  localidadFilter!: Observable<ILocalidades[]>;
  municipioCtrl = new FormControl<IMunicipios | null>(null);
  municipioFilter!: Observable<IMunicipios[]>;
  estadoCtrl = new FormControl<IEstados | null>(null);
  estadoFilter!: Observable<IEstados[]>;
  responsableCtrl = new FormControl<IResponsablesResponse | null>(null);
  responsableFilter!: Observable<IResponsablesResponse[]>;
  llamadaCtrl = new FormControl<ILlamadaCategoriaResponse | null>(null);
  llamadaFilter!: Observable<ILlamadaCategoriaResponse[]>;
  agenteAsignadoCtrl = new FormControl<IAgentesAsignadosResponse | null>(null);
  agenteAsignadoFilter!: Observable<IAgentesAsignadosResponse[]>;
  CasoCtrl = new FormControl<ICasoCategoriaResponse | null>(null);
  CasoFilter!: Observable<ICasoCategoriaResponse[]>;
  incidenciaForm!: FormGroup;
  agentesForm!: FormGroup;
  isLoading: boolean = false;
  readonlyHomologacion:boolean=false;
  noCliente: string = '';
  Prioridades: IPrioridadResponse[] = [];
  TipoMotivoAtraso: ITipoMotivoAtrasoResponse[] = [];
  Estatus: IEstatusResponse[] = [];
  Incidencias: IIncidencia[] = [];
  Categorias: ICategoriasResponse[] = [];
  TipoHomologacion: ITipoHomologacionResponse[] = [];
  Homologacion: IHomologacionResponse[] = [];
  AgentesAsignado: IAgentesAsignadosResponse[] = [];
  CasoCategoria: ICasoCategoriaResponse[] = [];
  CasoFiltroCategoria: ICasoCategoriaResponse[] = [];
  Agentes: IAgentesResponse[] = [];
  Responsables: IResponsablesResponse[] = [];
  LlamadaCategoria: ILlamadaCategoriaResponse[] = [];
  //  CasoCategoria: ICasoCategoriaResponse[] = [];
  Pais: IPais[] = [];
  Estados: IEstados[] = [];
  Municipios: IMunicipios[] = [];
  Localidades: ILocalidades[] = [];
  TipoSeguimiento: ITipoSeguimientoResponse[] = [];
  FechaHora: IFechaHora[] = [];
  isCliente: boolean = false;
  checkCliente:boolean =true;
  fechaHora: boolean = true;
  puesto: string = '';
  email: string = '';
  sucursal: string = '';
  estadoSeleccionado: string = '';
  municipioSeleccionado: string = '';
  localidadSeleccionada: string = '';
  Seguimientos: ISeguimiento[] = [];
  Verificacion: IVerificacion[] = [];
  buscar: boolean = false;
  displayedColumns: string[] = ['acciones', 'responsable', 'sucursal', 'puesto', 'tipoenvio', 'email'];
  displayedColumnsFile: string[] = ['acciones', 'nombre', 'tipo'];
  durationInSeconds = 5;
  creadoPor!: string;
  isLoadingSave: boolean = false;
  pais: boolean = true;
  validacionSecciones: string[] = [];
  canbuscarCliente: boolean = false;
  canAdd: boolean = false;
  addSeguimiento: boolean = false;
  readonlyTipoH: boolean = true;
  otroTipoLlamada: boolean = false;
  readonlyH: boolean = true;
  TipoEnvioEmail: ITipoEnvioEmailResponse[] = [];
  readonly: boolean = false;
  dataSource: MatTableDataSource<IAgentesAsignadosResponse> = new MatTableDataSource();

  dataSourceFile: MatTableDataSource<IArchivoModel> = new MatTableDataSource();
  @ViewChild('triggerEstados', { read: MatAutocompleteTrigger })
  autocompleteEstados!: MatAutocompleteTrigger;

  @ViewChild('triggerMunicipios', { read: MatAutocompleteTrigger })
  autocompleteMunicipios!: MatAutocompleteTrigger;

  @ViewChild('triggerLocalidades', { read: MatAutocompleteTrigger })
  autocompleteLocalidades!: MatAutocompleteTrigger;

  @ViewChild('triggerResponsables', { read: MatAutocompleteTrigger })
  autocompleteResponsable!: MatAutocompleteTrigger;

  @ViewChild('triggerLlamadaCategoria', { read: MatAutocompleteTrigger })
  autocompleteLlamadaCategoria!: MatAutocompleteTrigger;

  @ViewChild('triggerAgentesAsignado', { read: MatAutocompleteTrigger })
  autocompleteAgentesAsignado!: MatAutocompleteTrigger;

  @ViewChild('triggerCasoCategoria', { read: MatAutocompleteTrigger })
  autocompleteCasoCategoria!: MatAutocompleteTrigger;


  private _snackBar = inject(MatSnackBar);
  //localidadesSubject = new BehaviorSubject<ILocalidades[]>([]);
  constructor(private dialog: MatDialogRef<IncidenciaNuevaComponent>,
    private dialogGeneral: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder,
    private methodsService: GenericService,
    private auth: AuthService,
    private permisosService: PermisosService) {
    this.incidenciaForm = this.fb.group({
      DatosPersonales: this.fb.group({
        IdPersona: [0],
        NoCliente: [''],
        Nombre: ['', Validators.required],
        ApellidoPaterno: ['', Validators.required],
        ApellidoMaterno: ['', Validators.required],
        INE: ['', []],
        FechaNacimiento: [null,Validators.required],
        Telefono: ['', []],
        Curp: ['', []],
        Pais: ['MX', Validators.required],
        Estado: [''],
        Municipio: ['',],
        Localidad: [''],
        Direccion: ['', []],
        EsCliente: [false],

      }),
      DatosCredito: this.fb.group({
        Grupo: [''],
        Ciclo: [''],
        Oficial: [''],
        Sucursal: ['']
      }),
      DatosIncidencia: this.fb.group({
        IdIncidencia: [0],
        Folio: [''],
        Categoria: [null, Validators.required],
        Satisfaccion: [''],
        Prioridad: [null, Validators.required],
        Responsable: [null],
        Estatus: [null, Validators.required],
        FechaInicio: [''],
        HoraInicio: [''],
        FechaFin: [''],
        HoraFin: [''],
        DescripcionIncidencia: ['', Validators.required],
        AnalisisOrigen: [''],
        Acuerdo: [''],
        Compromiso: [''],
        MotivoLlamada: [0],
        Caso: [0],
        TipoHomologacion: [0],
        Homologacion: [0],
        TipoMotivoAtraso: [0],
        MotivoAtraso: [''],
        OtraLlamada: ['',[]]
      }),
      DatosAgenteAsignado: this.fb.array([]),
      DatosEvidencias: this.fb.array([]),
      DatosSeguimientos: this.fb.array([]),
      DatosVerificacion: this.fb.array([])

    });

    this.agentesForm = this.fb.group({
      AgenteAsignado: [],
      SucursalAgente: [],
      Puesto: [],
      Email: [],
      TipoEnvio: [1]
    });

    this.creadoPor = localStorage.getItem('usuario')!;
  }
  ngOnInit(): void {
    // this.canAdd = this.permisosService.hasPermission('Incidencia', PermisosEnum.Crear);
    // this.canbuscarCliente = this.permisosService.hasPermission('Incidencia', PermisosEnum.BuscarCliente);

    this.cargarCatalogos();
    this.estadoFilter = this.estadoCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterEstados(value))
    );

    this.municipioFilter = this.municipioCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterMuncipios(value))
    );


    this.localidadFilter = this.localidadCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterLocalidades(value))
    );

    this.responsableFilter = this.responsableCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterResponsables(value))
    );

    this.llamadaFilter = this.llamadaCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterLlamadaCategoria(value))
    );

    this.agenteAsignadoFilter = this.agenteAsignadoCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterAgentesAsignado(value))
    );

    this.CasoFilter = this.CasoCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCaso(value))
    );
  }


  guardarIncidencia() {


this.evaluarCamposCondicionales(this.isCliente);
    

    if (this.incidenciaForm.invalid) {
      this.openSnackBar("Datos Obligatorios Revise (*)");
      this.incidenciaForm.markAllAsTouched();
      return;
    }

    if (this.estadoSeleccionado == '' || this.municipioSeleccionado == '' || this.localidadCtrl.value?.TABARCOD == '' || this.localidadCtrl.value?.TABARCOD == undefined) {
      this.openSnackBar("Revise los datos de Estado/Municipio/Localidad");
      return;
    }

    if (this.responsableCtrl.value?.IdResponsable == undefined || this.responsableCtrl.value?.IdResponsable == '') {
      this.openSnackBar("Seccion Datos Incidencia: Agrege un Responsable");
      return;
    }

    if(this.otroTipoLlamada == false){
if (this.llamadaCtrl.value?.IdLlamadaCategoria == undefined || this.llamadaCtrl.value?.IdLlamadaCategoria == 0) {
      this.openSnackBar("Seccion Datos Incidencia: Agrege el Tipo de Llamada");
      return;
    }

    if (this.CasoCtrl.value?.IdCasoCategoria == undefined || this.CasoCtrl.value?.IdCasoCategoria == 0) {
      this.openSnackBar("Seccion Datos Incidencia: Agrege el Caso del tipo de Llamada");
      return;
    }
    }
    

    this.isLoadingSave = true;
    this.openSnackBar("Registrando incidencia espere por favor....... ");
    this.dateFix();

    this.fillDatosAgenteAsignado();
    this.fillDatosEvidencias();
    this.fillDatosSeguimientos();
    this.fillDatosVerificacion();

    const payload = {
      ...this.incidenciaForm.value,
      DatosPersonales: {
        ...this.incidenciaForm.value.DatosPersonales,
        NoCliente: this.noCliente,
        Estado: this.estadoSeleccionado,
        Municipio: this.municipioSeleccionado,
        Localidad: this.localidadCtrl.value?.TABARCOD,
        EsCliente: this.isCliente
      },
      DatosIncidencia: {
        ...this.incidenciaForm.value.DatosIncidencia,
        Responsable: this.responsableCtrl.value?.IdResponsable,
        MotivoLlamada: this.llamadaCtrl.value?.IdLlamadaCategoria,
        Caso: this.CasoCtrl.value?.IdCasoCategoria
      }

    };

    const formData = new FormData();


    const formValue = payload;


    const formValueSinArchivos = {
      ...formValue,
      DatosArchivo: formValue.DatosEvidencias.map((a: any) => ({
        Nombre: a.Nombre,
        Tipo: a.Tipo,
        FechaSubida: a.FechaSubida
      }))
    };

    formData.append('datos', JSON.stringify(formValueSinArchivos));


    this.dataSourceFile.data.forEach((archivo: IArchivoModel) => {
      if (archivo.Archivo) {
        formData.append('archivos', archivo.Archivo);
      }
    });




    this.methodsService.HttpPost('Incidencia/create-incidencia', {}, formData).subscribe({
      next: (response) => {


        this.isLoadingSave = false;
        this.openSnackBar("La incidencia se registro con exito....... ");

        this.closeDialog();
      },
      error: (error) => {
        this.isLoadingSave = false;
        if (error.status === 401) {
          this.openSnackBar("No autorizado. Por favor, inicia sesión.");
          // Aquí puedes redirigir al login o hacer otra acción
        } else {
          // Mensaje genérico para otros errores

          this.openSnackBar("Error: " + (error.error.message || "Error desconocido"));
          this.openSnackBar("La Vista se cerrara por posibles errores verique que la incidencia no fue creada, si fue creada favor de editar e intentar enviar los correos....... ");

          this.closeDialog();
        }
      }
    });


  }

  evaluarCamposCondicionales(esCliente: boolean) {

  const camposAValidar = ['DatosPersonales.INE', 'DatosPersonales.Telefono','DatosPersonales.Curp','DatosPersonales.Direccion'];

  
  camposAValidar.forEach(nombreCampo => {
    const campo = this.incidenciaForm.get(nombreCampo);

    if (campo) {
      if (esCliente) {
        
        campo.setValidators([Validators.required]);
      } else {
     
        campo.clearValidators();
        campo.markAsUntouched(); 
        campo.setValue(''); // 
      }


      campo.updateValueAndValidity();
    }
  });

  
  this.incidenciaForm.updateValueAndValidity();
}

  validarDatos(seccion: string): boolean {

    const grupo = this.incidenciaForm.get(seccion) as FormGroup;

    for (const controlName in grupo.controls) {
      const control = grupo.get(controlName);
      if (control?.validator && control.errors?.['required']) {

        if (controlName == 'Responsable') {
          if (this.responsableCtrl.value?.IdResponsable) {
            if (this.responsableCtrl.value.IdResponsable != '')
              return true;
            else
              return false;
          }
        }
        return false; // faltan campos obligatorios
      }
    }

    return true; // todos los obligatorios completos
  }

  private dateFix() {

    if (this.incidenciaForm.get('DatosPersonales.FechaNacimiento')?.value !== null && this.incidenciaForm.get('DatosPersonales.FechaNacimiento')?.value !== undefined) {
      const dateForm = new Date(this.incidenciaForm.get('DatosPersonales.FechaNacimiento')?.value).toISOString();

      this.incidenciaForm.patchValue({
        DatosPersonales: {
          FechaNacimiento: dateForm
        }
      });
    }


  }
  get DatosAgenteAsignadoArray(): FormArray {
    return this.incidenciaForm.get('DatosAgenteAsignado') as FormArray;
  }

  get datosEvidenciasArray(): FormArray {
    return this.incidenciaForm.get('DatosEvidencias') as FormArray;
  }

  get datosSeguimientosArray(): FormArray {
    return this.incidenciaForm.get('DatosSeguimientos') as FormArray;
  }

  get datosVerificacionArray(): FormArray {
    return this.incidenciaForm.get('DatosVerificacion') as FormArray;
  }


  createResponsable(asignado: IAgentesAsignadosResponse): FormGroup {
   
    return this.fb.group({
      IdAsignacionEnviada: [0],
      IdAsignacionIncidencia: [0],
      IdAgente: [asignado.IdAgente],
      NombreAgente: [asignado.NombreAgente],
      Email: [asignado.Email],
      Puesto: [asignado.Puesto],
      Sucursal: [asignado.Sucursal],
      Activo: [true],
      IdTipoEnvio: [asignado.IdTipoEnvio]
    });
  }

  createEvidencias(archivo: any): FormGroup {
    return this.fb.group({
      IdArchivo: [0],
      Nombre: [archivo.Nombre],
      Tipo: [archivo.Tipo],
      FechaSubida: [archivo.FechaSubida],
      Archivo: [archivo.Archivo]
    });
  }

  createSeguimientos(seguimiento: any): FormGroup {
    return this.fb.group({
      IdSeguimiento: [0],
      IdIncidencia: [0],
      FechaRegistro: [seguimiento.FechaRegistro],
      Descripcion: [seguimiento.Descripcion],
      TipoSeguimiento: [seguimiento.TipoSeguimiento]

    });
  }

  createVerificacion(verificacion: any): FormGroup {
    return this.fb.group({
      IdVerificacion: [0],
      IdIncidencia: [0],
      DiaVerificacion: [verificacion.DiaVerificacion],
      Descripcion: [verificacion.Descripcion],
      FechaInicio: [verificacion.FechaInicio],
      FechaFin: [verificacion.FechaFin],
      Activo: true

    });
  }

  fillDatosAgenteAsignado() {
    // Limpiamos el FormArray por si acaso
    this.DatosAgenteAsignadoArray.clear();

    // Recorremos la variable y agregamos cada responsable
    this.dataSource.data.forEach(resp => {
      this.DatosAgenteAsignadoArray.push(this.createResponsable(resp));
    });
  }

  fillDatosCasos() {
    // Limpiamos el FormArray por si acaso
    this.DatosAgenteAsignadoArray.clear();

    // Recorremos la variable y agregamos cada responsable
    this.dataSource.data.forEach(resp => {
      this.DatosAgenteAsignadoArray.push(this.createResponsable(resp));
    });
  }

  fillLlamadaMotivo() {
    // Limpiamos el FormArray por si acaso
    this.DatosAgenteAsignadoArray.clear();

    // Recorremos la variable y agregamos cada responsable
    this.dataSource.data.forEach(resp => {
      this.DatosAgenteAsignadoArray.push(this.createResponsable(resp));
    });
  }

  fillDatosEvidencias() {
    // Limpiamos el FormArray por si acaso
    this.datosEvidenciasArray.clear();

    // Recorremos la variable y agregamos cada responsable
    this.dataSourceFile.data.forEach(resp => {
      this.datosEvidenciasArray.push(this.createEvidencias(resp));
    });
  }

  fillDatosSeguimientos() {
    // Limpiamos el FormArray por si acaso
    this.datosSeguimientosArray.clear();

    // Recorremos la variable y agregamos cada responsable
    this.Seguimientos.forEach(resp => {
      this.datosSeguimientosArray.push(this.createSeguimientos(resp));
    });
  }

  fillDatosVerificacion() {
    // Limpiamos el FormArray por si acaso
    this.datosVerificacionArray.clear();

    // Recorremos la variable y agregamos cada responsable
    this.Verificacion.forEach(resp => {
      this.datosVerificacionArray.push(this.createVerificacion(resp));
    });
  }

  private _filterEstados(value: string | IEstados | null): IEstados[] {
    const texto = typeof value === 'string' ? value : value?.TADEPNOM ?? '';
    return this.Estados.filter(l =>
      l.TADEPNOM.toLowerCase().includes(texto.toLowerCase())
    );
  }
  private _filterMuncipios(value: string | IMunicipios | null): IMunicipios[] {
    const texto = typeof value === 'string' ? value : value?.TAMUNNOM ?? '';
    return this.Municipios.filter(l =>
      l.TAMUNNOM.toLowerCase().includes(texto.toLowerCase())
    );
  }

  private _filterLocalidades(value: string | ILocalidades | null): ILocalidades[] {
    const texto = typeof value === 'string' ? value : value?.TABARNOM ?? '';
    return this.Localidades.filter(l =>
      l.TABARNOM.toLowerCase().includes(texto.toLowerCase())
    );
  }

  private _filterResponsables(value: string | IResponsablesResponse | null): IResponsablesResponse[] {
    const texto = typeof value === 'string' ? value : value?.NombreResponsable ?? '';
    return this.Responsables.filter(l =>
      l.NombreResponsable.toLowerCase().includes(texto.toLowerCase())
    );
  }

  private _filterLlamadaCategoria(value: string | ILlamadaCategoriaResponse | null): ILlamadaCategoriaResponse[] {
    const texto = typeof value === 'string' ? value : value?.Codigo ?? '';
    return this.LlamadaCategoria.filter(l =>
      l.Codigo.toLowerCase().includes(texto.toLowerCase())
    );
  }

  private _filterAgentesAsignado(value: string | IAgentesAsignadosResponse | null): IAgentesAsignadosResponse[] {
    const texto = typeof value === 'string' ? value : value?.NombreAgente ?? '';
    return this.AgentesAsignado.filter(l =>
      l.NombreAgente.toLowerCase().includes(texto.toLowerCase())
    );
  }

  private _filterCaso(value: string | ICasoCategoriaResponse | null): ICasoCategoriaResponse[] {
    const texto = typeof value === 'string' ? value : value?.Codigo ?? '';
    return this.CasoFiltroCategoria.filter(l =>
      l.Codigo.toLowerCase().includes(texto.toLowerCase())
    );
  }

  displayLocalidad(localidad: ILocalidades | null): string {
    return localidad ? localidad.TABARNOM : '';
  }

  displayMunicipio(municipio: IMunicipios | null): string {
    return municipio ? municipio.TAMUNNOM : '';
  }

  displayEstados(estado: IEstados | null): string {
    return estado ? estado.TADEPNOM : '';
  }

  displayResponsables(responsable: IResponsablesResponse | null): string {
    return responsable ? responsable.NombreResponsable : '';
  }

  displayLlamadaCategoria(llamadaCategoria: ILlamadaCategoriaResponse | null): string {
    return llamadaCategoria ? llamadaCategoria.Codigo : '';
  }

  displayAgentesAsignados(agente: IAgentesAsignadosResponse | null): string {
    return agente ? agente.NombreAgente : '';
  }


  displayCasoCategoria(caso: ICasoCategoriaResponse | null): string {
    return caso ? caso.Codigo : '';
  }

  mostraropcionesEstados() {
    const valorActual = this.estadoCtrl.value;
    this.estadoCtrl.setValue(null);
    this.estadoCtrl.setValue(valorActual);


    this.autocompleteEstados.openPanel();
  }

  mostraropcionesMunicipios() {
    const valorActual = this.municipioCtrl.value;
    this.municipioCtrl.setValue(null);
    this.municipioCtrl.setValue(valorActual);


    this.autocompleteMunicipios.openPanel();
  }

  mostraropcionesLocalidades() {
    const valorActual = this.localidadCtrl.value;
    this.localidadCtrl.setValue(null);
    this.localidadCtrl.setValue(valorActual);


    this.autocompleteLocalidades.openPanel();
  }


  mostraropcionesResponsables() {

    const valorActual = this.responsableCtrl.value;
    this.responsableCtrl.setValue(null);

    this.responsableCtrl.setValue(valorActual);


    this.autocompleteResponsable.openPanel();
  }

  mostraropcionesLlamadaCategoria() {

    const valorActual = this.llamadaCtrl.value;
    this.llamadaCtrl.setValue(null);

    this.llamadaCtrl.setValue(valorActual);

    this.autocompleteLlamadaCategoria.openPanel();
  }

  mostraropcionesCasoCategoria() {

    const valorActual = this.CasoCtrl.value;
    this.CasoCtrl.setValue(null);

    this.CasoCtrl.setValue(valorActual);


    this.autocompleteCasoCategoria.openPanel();
  }

  mostraropcionesAgentesAsignado() {
    const valorActual = this.agenteAsignadoCtrl.value;
    this.agenteAsignadoCtrl.setValue(null);

    this.agenteAsignadoCtrl.setValue(valorActual);


    this.autocompleteAgentesAsignado.openPanel();
  }

  cargarDatosIncidencia() {

    this.incidenciaForm.patchValue({
      DatosIncidencia: {
        FechaInicio: this.FechaHora[0].fechaInicio,
        HoraInicio: this.FechaHora[0].horaInicio,
        FechaFin: this.FechaHora[0].fechaFin,
        HoraFin: this.FechaHora[0].horaFin
      }

    });
  }
  seguimientoNuevo() {

  }
  readonly panelOpenState = signal(false);

  buscarCliente() {
    const dialogRef = this.dialogGeneral.open(BuscarClienteComponent, {
      autoFocus: false,
      minWidth: '95%',
      minHeight: '90%',
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result != "close")
        this.cargarDatosPersonales(result)
    });
  }

  cargarDatosPersonales(datos: any) {

    this.incidenciaForm.patchValue({
      DatosPersonales: {
        Nombre: datos.GFCLINO1 + ' ' + datos.GFCLINO2,
        ApellidoPaterno: datos.GFCLIAP1,
        ApellidoMaterno: datos.GFCLIAP2,
        FechaNacimiento: datos.GFCLIFNA,
        Telefono: datos.GFCLITEL,

        Direccion: datos.GFCLIDIR,

        Curp: datos.GFCLICUR,
        INE: datos.GFCLIINE,
        Pais: datos.TAPAICOD,
        Estado: datos.TADEPNOM,
        Municipio: datos.TAMUNCOD,
        EsCliente: true
      },
      DatosCredito: {
        Grupo: datos.GRUPO,
        Sucursal: datos.SUCURSALGRUP,
        Ciclo: datos.CICLO,
        Oficial: datos.OFICIAL
      }

    });

    this.buscar = true;

    const estado = { TADEPCOD: datos.TADEPCOD, TADEPNOM: datos.TADEPNOM }
    this.estadoCtrl.setValue(estado);
    this.onEstadoChange(estado);

    const municipio = { TAMUNCOD: datos.TAMUNCOD, TAMUNNOM: datos.TAMUNNOM }
    this.municipioCtrl.setValue(municipio);
    this.onMunicipioChange(municipio);

    const localidad = { TABARCOD: datos.TABARCOD, TABARNOM: datos.TABARNOM }
    this.localidadCtrl.setValue(localidad);

    this.noCliente = datos.GFCLINUM;
    this.isCliente = true;
    this.checkCliente=true;
    this.buscar = false;
    this.readonly = true;
  }

  limpiarDatosPersonales() {
    this.incidenciaForm.patchValue({
      Nombre: '',
      ApellidoPaterno: '',
      ApellidoMaterno: '',
      FechaNacimiento: '',
      Telefono: '',
      INE: '',
      Curp: '',
      Direccion: '',
      EsCliente: false
    });
    this.noCliente = '0'
  }

  cargarCatalogos() {
    const token = this.auth.getToken();

    setTimeout(() => {
      this.isLoading = false;
      this.methodsService.HttpGet('Categorias/get-categoria', {}).subscribe({
        next: (response: ResponseData<ICategoriasResponse[]>) => {
          this.Categorias = response.data;
          this.isLoading = false;
        }, error: () => {

          this.isLoading = false;
        }
      });

      this.methodsService.HttpGet('Catalagos/get-tipohomologacion', {}).subscribe({
        next: (response: ResponseData<ITipoHomologacionResponse[]>) => {
          this.TipoHomologacion = response.data;
    
          this.isLoading = false;
        }, error: () => {

          this.isLoading = false;
        }
      });

      this.methodsService.HttpGet('Catalagos/get-homologacion', {}).subscribe({
        next: (response: ResponseData<IHomologacionResponse[]>) => {
          this.Homologacion = response.data;
    
          this.isLoading = false;
        }, error: () => {

          this.isLoading = false;
        }
      });
      this.methodsService.HttpGet('Agentes/get-agentes', {}).subscribe({
        next: (response: ResponseData<IAgentesAsignadosResponse[]>) => {
          this.AgentesAsignado = response.data;

          this.isLoading = false;
        }, error: () => {
          this.isLoading = false;
        }
      });

      this.methodsService.HttpGet('Catalagos/get-responsables', {}).subscribe({
        next: (response: ResponseData<IResponsablesResponse[]>) => {
          this.Responsables = response.data;
          this.isLoading = false;
        }, error: () => {
          this.isLoading = false;
        }
      });

      this.methodsService.HttpGet('Catalagos/get-motivollamada', {}).subscribe({
        next: (response: ResponseData<ILlamadaCategoriaResponse[]>) => {
          this.LlamadaCategoria = response.data;
          this.isLoading = false;
        }, error: () => {
          this.isLoading = false;
        }
      });

      this.methodsService.HttpGet('Catalagos/get-casocategoria', {}).subscribe({
        next: (response: ResponseData<ICasoCategoriaResponse[]>) => {
          this.CasoCategoria = response.data;
          this.isLoading = false;
        }, error: () => {
          this.isLoading = false;
        }
      });

      this.methodsService.HttpGet('Catalagos/get-TipoEnvioEmail', {}).subscribe({
        next: (response: ResponseData<ITipoEnvioEmailResponse[]>) => {
          this.TipoEnvioEmail = response.data;
        
          this.isLoading = false;
        }, error: () => {
          this.isLoading = false;
        }
      });

      this.methodsService.HttpGet('Catalagos/get-tiposeguimiento', {}).subscribe({
        next: (response: ResponseData<ITipoSeguimientoResponse[]>) => {
          this.TipoSeguimiento = response.data;

          this.isLoading = false;
        }, error: () => {
          this.isLoading = false;
        }
      });


      this.methodsService.HttpGet('Catalagos/get-pais', {}).subscribe({
        next: (response: ResponseData<IPais[]>) => {
          this.Pais = response.data;
          this.isLoading = false;
        }, error: () => {
          this.isLoading = false;
        }
      });

      this.methodsService.HttpGet('Catalagos/get-estados', {}).subscribe({
        next: (response: ResponseData<IEstados[]>) => {
          this.Estados = response.data;
          this.isLoading = false;
        }, error: () => {
          this.isLoading = false;
        }
      });

      this.methodsService.HttpGet('Catalagos/get-fechaHora', {}).subscribe({
        next: (response: ResponseData<IFechaHora[]>) => {
          this.FechaHora = response.data;

          this.cargarDatosIncidencia();
          this.isLoading = false;
        }, error: () => {
          this.isLoading = false;
        }
      });

      this.methodsService.HttpGet('Prioridad/get-prioridad', {}).subscribe({
        next: (response: ResponseData<IPrioridadResponse[]>) => {
          this.Prioridades = response.data;
          this.isLoading = false;
        }, error: () => {
          this.isLoading = false;
        }
      });

      this.methodsService.HttpGet('Catalagos/get-tipoMotivoAtraso', {}).subscribe({
        next: (response: ResponseData<ITipoMotivoAtrasoResponse[]>) => {
          this.TipoMotivoAtraso = response.data;
          this.isLoading = false;
        }, error: () => {
          this.isLoading = false;
        }
      });

      this.methodsService.HttpGet('Estatus/get-new-estatus', {}).subscribe({
        next: (response: ResponseData<IEstatusResponse[]>) => {
          this.Estatus = response.data;

          const estatus = this.Estatus.findIndex(item => item.Codigo == 'PROCESANDO');

          this.incidenciaForm.get('DatosIncidencia.Estatus')?.setValue(response.data[0].IdEstatus);
          this.isLoading = false;
        }, error: () => {
          this.isLoading = false;
        }
      });

    }, 1000);

  }

  onSelectionAgentesAsignados(responsable: IResponsables) {
    this.puesto = responsable.Puesto;
    this.email = responsable.Email;
    this.sucursal = responsable.Sucursal
  }

  openSnackBar(aviso: string) {

    this._snackBar.openFromComponent(AvisosComponent, {

      duration: this.durationInSeconds * 1000,
      data: aviso,
      panelClass: ['custom-snackbar']

    });
  }
  onEstadoChange(estado: IEstados) {

    this.Municipios = [];
    this.Localidades = [];
    if (!this.buscar)
      this.localidadCtrl.setValue(null);
    this.localidadCtrl.updateValueAndValidity();

    if (!this.buscar)
      this.municipioCtrl.setValue(null);
    this.municipioCtrl.updateValueAndValidity();

    this.estadoSeleccionado = estado.TADEPCOD;

    this.methodsService.HttpGet('Catalagos/get-municipios', { TADEPCOD: estado.TADEPCOD }).subscribe({
      next: (response: ResponseData<IMunicipios[]>) => {
        this.Municipios = response.data;
        this.isLoading = false;
      }, error: () => {
        this.isLoading = false;
      }
    });

  }

  onLlamadaCategoriaChange(llamadaCategoria: ILlamadaCategoriaResponse) {

    this.CasoFiltroCategoria = [];

    if (!this.buscar)
      this.CasoCtrl.setValue(null);
    this.CasoCtrl.updateValueAndValidity();


    var IdLlamadaCategoria = llamadaCategoria.IdLlamadaCategoria;


    if(IdLlamadaCategoria == 0)
    {
       this.otroTipoLlamada = true;
       this.readonlyHomologacion = true;
      

  }
  else {
  this.otroTipoLlamada = false;
  this.readonlyHomologacion = false;
  this.incidenciaForm.get('DatosIncidencia.OtraLlamada')?.setValue('');
    }
    const resultados: ICasoCategoriaResponse[] = this.CasoCategoria.filter(item => item.IdLlamadaCategoria === IdLlamadaCategoria);

    this.incidenciaForm.get('DatosIncidencia.TipoHomologacion')?.setValue(0);
    this.incidenciaForm.get('DatosIncidencia.Homologacion')?.setValue(0);


    this.CasoFiltroCategoria = resultados;
  }

  onCasoCategoriaChange(caso: ICasoCategoriaResponse) {

    var IdTipoHomologacionCategoria = caso.IdTipoHomologacionCategoria;
    var IdHomologacionCategoria = caso.IdHomologacionCategoria;

    this.incidenciaForm.get('DatosIncidencia.TipoHomologacion')?.setValue(IdTipoHomologacionCategoria);
    this.incidenciaForm.get('DatosIncidencia.Homologacion')?.setValue(IdHomologacionCategoria);

  }

  onMunicipioChange(municipio: IMunicipios) {
    this.Localidades = [];

    this.localidadCtrl.setValue(null);
    this.localidadCtrl.updateValueAndValidity();
    this.municipioSeleccionado = municipio.TAMUNCOD;

    this.methodsService.HttpGet('Catalagos/get-localidades', { TAMUNCOD: municipio.TAMUNCOD, TADEPCOD: this.estadoSeleccionado }).subscribe({
      next: (response: ResponseData<ILocalidades[]>) => {
        this.Localidades = response.data;
        this.localidadCtrl.updateValueAndValidity();
        this.isLoading = false;
      }, error: () => {
        this.isLoading = false;
      }
    });

  }

  onLocalidadChange(localidad: ILocalidades) {
    this.localidadSeleccionada = localidad.TABARCOD;
  }

  agregarFile() {

  }

  onFileSelected(event: any) {

    const file: File = event.target.files[0];
    if (!file) return;

    const nuevoArchivo: IArchivoModel = {
      IdArchivo: 0,
      NombreArchivo: file.name,
      Tipo: file.type,
      Archivo: file,
      Url: URL.createObjectURL(file),
      FechaSubida: new Date(),
      Activo: true
    };

    this.dataSourceFile.data = [...this.dataSourceFile.data, nuevoArchivo];
    event.target.value = '';
  }

  removeAgenteData(data: any) {


    const index = this.dataSource.data.findIndex(item => item.IdAgente == data.IdAgente)
    if (index !== -1) {

      this.dataSource.data.splice(index, 1);
      this.dataSource.data = [...this.dataSource.data];

    }

  }

  verFile(archivo: IArchivoModel) {

    if (archivo.Tipo.includes('audio')) {

      this.dialogGeneral.open(VisorArchivoComponent, {
        data: archivo,
        autoFocus: false,
        minWidth: '40%',
        minHeight: '10vh',
        disableClose: true,
        panelClass: 'custom-dialog-containerAudio'
      });
    }
    else {
      this.dialogGeneral.open(VisorArchivoComponent, {
        data: archivo,
        autoFocus: false,
        minWidth: '90%',
        minHeight: '90%',
        disableClose: true,
        panelClass: 'custom-dialog-container'
      });

    }
  }

  removeFile(data: any) {

    const index = this.dataSourceFile.data.findIndex(item => item.NombreArchivo == data.NombreArchivo)
    if (index !== -1) {

      this.dataSourceFile.data.splice(index, 1);
      this.dataSourceFile.data = [...this.dataSourceFile.data];

    }



  }

  guardarAgente() {

    const agente = this.agenteAsignadoCtrl.value;// this.agentesForm.value.Agente;

    if (agente != null) {
      const index = this.dataSource.data.findIndex(item => item.IdAgente == agente.IdAgente)
      if (index !== -1) {
        this.openSnackBar("El responsable ya esta asignado");

      } else {
        const idSeleccionado = this.agentesForm.get('TipoEnvio')?.value;

        // 2. Buscas el objeto completo en tu lista
        const tipoEnvioEncontrado = this.TipoEnvioEmail.find(t => t.IdTipoEnvio === idSeleccionado);

        // 3. ¡Aquí tienes el texto/código listo!
        const textoTipoEnvio = tipoEnvioEncontrado ? tipoEnvioEncontrado.Codigo : '';

        var agenteAsigndo = {
          Email: agente.Email,
          IdAgente: agente.IdAgente,
          NombreAgente: agente.NombreAgente,
          Puesto: agente.Puesto,
          Sucursal: agente.Sucursal,
          TipoEnvio: textoTipoEnvio,
          IdTipoEnvio: idSeleccionado

        };

        this.dataSource.data = [...this.dataSource.data, agenteAsigndo];
      }

      this.agentesForm.reset();

    } else {
      this.openSnackBar("No ha seleccionado un responable");
    }

    this.agenteAsignadoCtrl.setValue(null);
    this.agentesForm.patchValue({
      TipoEnvio: 1
    });

  }

  cargarSeguimientos() {

    this.methodsService.HttpGet('Seguimiento/get-seguimiento', { idIncidencia: this.data.dataIncidencia.idIncidencia }).subscribe({
      next: (response: ISeguimiento[]) => {
        this.Seguimientos = response;

        this.isLoading = false;
      }, error: () => {
        this.isLoading = false;
      }
    });
  }

  cargarVencimiento() {

    this.methodsService.HttpGet('Seguimiento/get-vencimiento', { idIncidencia: this.data.dataIncidencia.idIncidencia }).subscribe({
      next: (response: IVerificacion[]) => {
        this.Verificacion = response;

        this.isLoading = false;
      }, error: () => {
        this.isLoading = false;
      }
    });
  }

  agregarSeguimiento() {

    if (this.validarDatos('DatosIncidencia')) {

      const dialogRef = this.dialogGeneral.open(SeguimientoComponent, {
        data: { data: this.TipoSeguimiento },
        autoFocus: false,
        minWidth: '50%',
        minHeight: '40%',
        disableClose: true,
        panelClass: 'custom-dialog'
      });


      dialogRef.afterClosed().subscribe(result => {

        if (result != 'close') {
          const datosIncidencia = this.incidenciaForm.value.DatosIncidencia;

          const estatus = this.Estatus.find(item => item.IdEstatus == datosIncidencia.Estatus);
          const categoria = this.Categorias.find(item => item.IdCategoria == datosIncidencia.Categoria);

          const seguimiento = {
            IdSeguimiento: this.Seguimientos.length + 1,
            IdIncidencia: 0,
            TipoSeguimiento: result.TipoSeguimiento,
            FechaRegistro: new Date,// this.FechaHora[0].fechaInicio + ' ' + this.FechaHora[0].horaInicio,
            Descripcion: result.Descripcion,
            Categoria: categoria == null ? '' : categoria.Codigo,
            Estatus: estatus == null ? '' : estatus.Codigo,
            Usuario: this.creadoPor,
            Tipo: '',
            Registro: ''
          }
          this.Seguimientos.push(seguimiento);
        }


      });


    } else {
      this.openSnackBar("Para agregar seguimientos debe completar la Seccion Datos Incidencia");
    }



  }

  agregarVerificacion() {
    if (this.validarDatos('DatosIncidencia')) {
      const dialogRef = this.dialogGeneral.open(VerificacionComponent, {
        data: { data: this.FechaHora[0] },
        autoFocus: false,
        minWidth: '85%',
        minHeight: '35%',
        disableClose: true,
        panelClass: 'custom-dialog'
      });

      dialogRef.afterClosed().subscribe(result => {


        if (result != 'close') {
          const verificacion = {
            IdVerificacion: this.Verificacion.length + 1,
            IdIncidencia: 0,
            DiaVerificacion: this.Verificacion.length + 1,
            Descripcion: result.Descripcion,
            FechaInicio: result.FechaInicio,
            FechaFin: result.FechaFin,
            Activo: true,
            UsuarioRegistro: this.creadoPor
          }
          this.Verificacion.push(verificacion);

        }


      });
    } else {
      this.openSnackBar("Para agregar verificaciones debe completar la Seccion Datos Incidencia");
    }


  }

  closeDialog() {
    this.dialog.close('close');
  }
}
