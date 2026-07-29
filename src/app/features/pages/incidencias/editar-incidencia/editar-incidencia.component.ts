
import { IAgentesAsignadosResponse, IAgentesAsigResponse, ICasoCategoriaResponse, IFechaHora, IHomologacionResponse, ILlamadaCategoriaResponse, ILocalidades, IMunicipios, IResponsablesResponse, ISucursalZonaFinanciera, ITipoEnvioEmailResponse, ITipoHomologacionResponse, ITipoMotivoAtrasoResponse, ITipoSeguimientoResponse } from './../../../../shared/models/Catalogos';
import { Component, inject, Inject, LOCALE_ID, OnInit, signal, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ToolbarComponent } from '../../../../shared/components/toolbar/toolbar.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { IAgentesResponse, ICategoriasResponse, IEstados, IEstatusResponse, IPais, IPrioridadResponse } from '../../../../shared/models/Catalogos';
import { IIncidencia } from '../../../../shared/models/Incidencia';
import { GenericService } from '../../../../core/services/generic.service';
import { BuscarClienteComponent } from '../buscar-cliente/buscar-cliente.component';
import { ResponseData } from '../../../../shared/models/response-data.model';
import { SeguimientoComponent } from '../seguimiento/seguimiento.component';
import { VerificacionComponent } from '../verificacion/verificacion.component';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { catchError, forkJoin, map, Observable, of, startWith } from 'rxjs';
import { ISeguimiento } from '../../../../shared/models/Seguimiento';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { IResponsables } from '../../../../shared/models/Responsable';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AuthService } from '../../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IArchivoModel } from '../../../../shared/models/Archivos';
import { AvisosComponent } from '../../../../shared/avisos/avisos.component';
import { VisorArchivoComponent } from '../../../../shared/visor-archivo/visor-archivo.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { IVerificacion } from '../../../../shared/models/Verficiacion';
import { PermisosService } from '../../../../core/services/permisos.service';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';
import { Router } from '@angular/router';


@Component({
  selector: 'app-editar-incidencia',
  standalone: true,
  providers: [
    provideNativeDateAdapter(),

    DatePipe, CurrencyPipe],
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
    CommonModule,
    MatTableModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    HasPermissionDirective
  ],
  templateUrl: './editar-incidencia.component.html',
  styleUrl: './editar-incidencia.component.css'
})
export class EditarIncidenciaComponent implements OnInit {
  titulo: string = 'Editar Incidencia';
  localidadCtrl = new FormControl<ILocalidades | null>(null);
  localidadFilter!: Observable<ILocalidades[]>;
  municipioCtrl = new FormControl<IMunicipios | null>(null);
  municipioFilter!: Observable<IMunicipios[]>;
  estadoCtrl = new FormControl<IEstados | null>(null);
  estadoFilter!: Observable<IEstados[]>;
  responsableCtrl = new FormControl<IResponsablesResponse | null>(null);
  responsableFilter!: Observable<IResponsablesResponse[]>;
  agenteAsignadoCtrl = new FormControl<IAgentesAsigResponse | null>(null);
  agenteAsignadoFilter!: Observable<IAgentesAsigResponse[]>;
  llamadaCtrl = new FormControl<ILlamadaCategoriaResponse | null>(null);
  llamadaFilter!: Observable<ILlamadaCategoriaResponse[]>;
  CasoCtrl = new FormControl<ICasoCategoriaResponse | null>(null);
  CasoFilter!: Observable<ICasoCategoriaResponse[]>;
  CasoCategoria: ICasoCategoriaResponse[] = [];
  CasoFiltroCategoria: ICasoCategoriaResponse[] = [];
  incidenciaForm!: FormGroup;
  agentesForm!: FormGroup;
  isLoading: boolean = false;
  noCliente: string = '';
  Prioridades: IPrioridadResponse[] = [];
  SucursalZonaFina: ISucursalZonaFinanciera[] = [];
  TipoMotivoAtraso: ITipoMotivoAtrasoResponse[] = [];
  Estatus: IEstatusResponse[] = [];
  Incidencias: IIncidencia[] = [];
  Categorias: ICategoriasResponse[] = [];
  AgentesAsignado: IAgentesAsigResponse[] = [];
  Agentes: IAgentesResponse[] = [];
  Responsables: IResponsablesResponse[] = [];
  Pais: IPais[] = [];
  Estados: IEstados[] = [];
  Municipios: IMunicipios[] = [];
  Localidades: ILocalidades[] = [];
  TipoSeguimiento: ITipoSeguimientoResponse[] = [];
  FechaHora: IFechaHora[] = [];
  isCliente: boolean = false;
  fechaHora: boolean = true;
  puesto: string = '';
  email: string = '';
  estadoSeleccionado: string = '';
  municipioSeleccionado: string = '';
  localidadSeleccionada: string = '';
  Seguimientos: ISeguimiento[] = [];
  Verificaciones: IVerificacion[] = [];
  DataSeguimientos: ISeguimiento[] = [];
  buscar: boolean = false;
  displayedColumns: string[] = ['acciones', 'responsable', 'sucursal', 'puesto', 'email', 'tipoenvio', 'enviado', 'reenviar'];
  displayedColumnsFile: string[] = ['acciones', 'nombre', 'tipo'];
  durationInSeconds = 5;
  creadoPor!: string;
  sucursal: string = '';
  isLoadingSave: boolean = false;
  otroTipoLlamada: boolean = false;
  validacionSecciones: string[] = [];
  safeUrl!: SafeResourceUrl;
  AgentesOriginales: IAgentesAsigResponse[] = [];
  ArchivosOriginales: IArchivoModel[] = [];
  TipoHomologacion: ITipoHomologacionResponse[] = [];
  Homologacion: IHomologacionResponse[] = [];
  SelectHomologacion: IHomologacionResponse[] = [];
  LlamadaCategoria: ILlamadaCategoriaResponse[] = [];
  IdIncidencia: number = 0;
  readonlyHomologacion: boolean = false;
  Readonly: boolean = true;
  readonlyTipoH: boolean = true;
  readonlyH: boolean = true;
  readonlyZona: boolean = false;
  escliente: boolean = true;
  totalVerificaciones: boolean = false;
  canEdit: boolean = false;
  finalizado: boolean = false;
  blobUrlSafe!: SafeUrl;
  mostrarHomologacion: boolean = false;
  TipoEnvioEmail: ITipoEnvioEmailResponse[] = [];
  dataSource: MatTableDataSource<IAgentesAsigResponse> = new MatTableDataSource<IAgentesAsigResponse>();

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

  @ViewChild('triggerCasoCategoria', { read: MatAutocompleteTrigger })
  autocompleteCasoCategoria!: MatAutocompleteTrigger;


  @ViewChild('triggerAgentesAsignado', { read: MatAutocompleteTrigger })
  autocompleteAgentesAsignado!: MatAutocompleteTrigger;

  private _snackBar = inject(MatSnackBar);

  constructor(private dialog: MatDialogRef<EditarIncidenciaComponent>,
    private sanitizer: DomSanitizer,
    private router: Router,
    private dialogGeneral: MatDialog,
    private permisosService: PermisosService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder,
    private methodsService: GenericService,
    private auth: AuthService) {
    this.incidenciaForm = this.fb.group({
      DatosPersonales: this.fb.group({
        IdPersona: [0],
        NoCliente: [''],
        Nombre: ['', Validators.required],
        ApellidoPaterno: ['', Validators.required],
        ApellidoMaterno: ['', Validators.required],
        INE: ['', []],
        FechaNacimiento: [null, Validators.required],
        Telefono: ['', []],
        Curp: ['', []],
        Pais: ['MX', Validators.required],
        Estado: [''],
        Municipio: ['',],
        Localidad: [''],
        Direccion: ['', []],
        EsCliente: [false],
        Sucursal: [''],
        ZonaFinanciera: [''],
        IdDireccion: [0]

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
        MotivoLlamada: [null],
        Caso: [null],
        // TipoHomologacion: [null],
        Homologacion: [null],
        TipoMotivoAtraso: [0],
        MotivoAtraso: [''],
        OtraLlamada: ['']
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

    this.creadoPor = localStorage.getItem('usuario')!;

    this.estadoCtrl.disable();
    this.municipioCtrl.disable();
    this.localidadCtrl.disable();

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

    this.dataSource.data.forEach((agente: IAgentesAsigResponse) => {
      const agt = this.AgentesOriginales.find(a => a.IdAgente === agente.IdAgente);
      if (!agt) {
        this.AgentesOriginales.push(agente);
      }
    });

    this.dataSourceFile.data.forEach((archivo: IArchivoModel) => {
      const file = this.ArchivosOriginales.find(a => a.IdArchivo === archivo.IdArchivo);
      if (!file) {

        if (file)
          this.ArchivosOriginales.push(file);
      }
    });




    if (this.incidenciaForm.invalid) {
      this.openSnackBar("Datos Obligatorios Revise (*)");
      this.incidenciaForm.markAllAsTouched();
      return;
    }

    this.isLoadingSave = true;
    this.openSnackBar("Registrando incidencia espere por favor....... ");
    this.dateFix();

    this.fillDatosAgenteAsignado();
    this.fillDatosEvidencias();
    this.fillDatosSeguimientos();
    this.fillDatosVerificaciones();
    var sucursal = this.incidenciaForm.get('DatosPersonales.Sucursal')?.value;
    console.log(sucursal)
    const payload = {
      ...this.incidenciaForm.value,
      DatosPersonales: {
        ...this.incidenciaForm.value.DatosPersonales,
        NoCliente: this.noCliente,
        Estado: this.estadoSeleccionado,
        Municipio: this.municipioSeleccionado,
        Localidad: this.localidadCtrl.value?.TABARCOD,
        EsCliente: this.isCliente,
        Sucursal: this.escliente ? '' : sucursal.IdSucursal,
        ZonaFinanciera: this.escliente ? '' : sucursal.IdSucursal
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


    this.methodsService.HttpPost('Incidencia/update-incidencia', {}, formData).subscribe({
      next: (response) => {
        this.isLoadingSave = false;
        this.openSnackBar("La incidencia se actualizo con exito....... ");

        this.closeDialogEditar();
      },
      error: (error) => {
        this.isLoadingSave = false;
        if (error.status === 401) {
          this.openSnackBar("Tu sesión ha expirado. Por favor, ingresa nuevamente");
          this.router.navigate(['/inicio']);

        } else {

          this.openSnackBar("Error: " + (error.error.message || "Error desconocido"));
        }
      }
    });

  }


  evaluarCamposCondicionales(esCliente: boolean) {

    const camposAValidar = ['DatosPersonales.INE', 'DatosPersonales.Telefono', 'DatosPersonales.Curp', 'DatosPersonales.Direccion'];


    camposAValidar.forEach(nombreCampo => {
      const campo = this.incidenciaForm.get(nombreCampo);

      if (campo) {
        if (esCliente) {

          campo.setValidators([Validators.required]);
        } else {

          campo.clearValidators();
          campo.markAsUntouched();
          // campo.setValue(''); // 
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

  get datosVerificacionesArray(): FormArray {
    return this.incidenciaForm.get('DatosVerificacion') as FormArray;
  }


  createResponsable(asignado: IAgentesAsigResponse): FormGroup {
    return this.fb.group({
      IdAsignacionEnviada: [asignado.IdAsignacionEnviada],
      IdAsignacionIncidencia: [asignado.IdAsignacionIncidencia],
      IdAgente: [asignado.IdAgente],
      NombreAgente: [asignado.NombreAgente],
      Email: [asignado.Email],
      Puesto: [asignado.Puesto],
      Sucursal: [asignado.Sucursal],
      Activo: [asignado.Activo],
      IdTipoEnvio: [asignado.IdTipoEnvio]
    });
  }

  createEvidencias(archivo: any): FormGroup {
    return this.fb.group({
      IdArchivo: [archivo.IdArchivo],
      Nombre: [archivo.Nombre],
      Tipo: [archivo.Tipo],
      FechaSubida: [archivo.FechaSubida],
      Archivo: [archivo.Archivo],
      Activo: [archivo.Activo]
    });
  }

  createSeguimientos(seguimiento: any): FormGroup {

    return this.fb.group({
      IdSeguimiento: [seguimiento.IdSeguimiento],
      IdIncidencia: [seguimiento.IdIncidencia],
      FechaRegistro: [seguimiento.FechaRegistro],
      Descripcion: [seguimiento.Descripcion],
      TipoSeguimiento: [seguimiento.TipoSeguimiento],
      Reenvio: [seguimiento.Reenvio]

    });
  }

  createVerificaciones(verificacion: any): FormGroup {
    return this.fb.group({
      IdVerificacion: [verificacion.IdVerificacion],
      IdIncidencia: [verificacion.IdIncidencia],
      DiaVerificacion: [verificacion.DiaVerificacion],
      Descripcion: [verificacion.Descripcion],
      FechaInicio: [verificacion.FechaInicio],
      FechaFin: [verificacion.FechaFin],
      Activo: [true]
    });
  }

  fillDatosAgenteAsignado() {
    // Limpiamos el FormArray por si acaso
    this.DatosAgenteAsignadoArray.clear();

    // Recorremos la variable y agregamos cada responsable
    this.AgentesOriginales.forEach(resp => {
      this.DatosAgenteAsignadoArray.push(this.createResponsable(resp));
    });
  }

  fillDatosEvidencias() {
    // Limpiamos el FormArray por si acaso
    this.datosEvidenciasArray.clear();

    // Recorremos la variable y agregamos cada responsable
    this.ArchivosOriginales.forEach(resp => {
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

  fillDatosVerificaciones() {
    // Limpiamos el FormArray por si acaso
    this.datosVerificacionesArray.clear();

    // Recorremos la variable y agregamos cada responsable
    this.Verificaciones.forEach(resp => {
      this.datosVerificacionesArray.push(this.createVerificaciones(resp));
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

  private _filterCaso(value: string | ICasoCategoriaResponse | null): ICasoCategoriaResponse[] {
    const texto = typeof value === 'string' ? value : value?.Codigo ?? '';
    return this.CasoFiltroCategoria.filter(l =>
      l.Codigo.toLowerCase().includes(texto.toLowerCase())
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


  private _filterAgentesAsignado(value: string | IAgentesAsigResponse | null): IAgentesAsigResponse[] {
    const texto = typeof value === 'string' ? value : value?.NombreAgente ?? '';
    return this.AgentesAsignado.filter(l =>
      l.NombreAgente.toLowerCase().includes(texto.toLowerCase())
    );
  }


  displayLocalidad(localidad: ILocalidades | null): string {
    return localidad ? localidad.TABARNOM : '';
  }

  displayLlamadaCategoria(llamadaCategoria: ILlamadaCategoriaResponse | null): string {
    return llamadaCategoria ? llamadaCategoria.Codigo : '';
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

  onLlamadaCategoriaChange(llamadaCategoria: ILlamadaCategoriaResponse) {

    this.CasoFiltroCategoria = [];

    if (!this.buscar)
      this.CasoCtrl.setValue(null);
    this.CasoCtrl.updateValueAndValidity();


    var IdLlamadaCategoria = llamadaCategoria.IdLlamadaCategoria;



    if (IdLlamadaCategoria == 0) {
      this.otroTipoLlamada = true;
      this.readonlyHomologacion = true;
      this.mostrarHomologacion = true;


    }
    else {
      this.mostrarHomologacion = false;
      this.otroTipoLlamada = false;
      this.readonlyHomologacion = false;
      this.incidenciaForm.get('DatosIncidencia.OtraLlamada')?.setValue('');
    }

    const resultados: ICasoCategoriaResponse[] = this.CasoCategoria.filter(item => item.IdLlamadaCategoria === IdLlamadaCategoria);

    //this.incidenciaForm.get('DatosIncidencia.TipoHomologacion')?.setValue(0);
    this.incidenciaForm.get('DatosIncidencia.Homologacion')?.setValue(0);

    this.CasoFiltroCategoria = resultados;
  }


  cargarDatosIncidencia() {
    this.isLoading = true;
    this.methodsService.HttpGet('Incidencia/get-IncidenciabyId', { IdIncidencia: this.data.dataIncidencia.IdIncidencia }).subscribe({
      next: (response) => {
        this.incidenciaForm.patchValue({
          DatosPersonales: {
            IdPersona: response.DatosPersonales.IdPersona,
            NoCliente: response.DatosPersonales.NoCliente,
            Nombre: response.DatosPersonales.Nombre,
            ApellidoPaterno: response.DatosPersonales.ApellidoPaterno,
            ApellidoMaterno: response.DatosPersonales.ApellidoMaterno,
            INE: response.DatosPersonales.INE,
            FechaNacimiento: response.DatosPersonales.FechaNacimiento,
            Telefono: response.DatosPersonales.Telefono,
            Curp: response.DatosPersonales.Curp,
            EsCliente: response.DatosPersonales.EsCliente,
            Pais: response.DatosPersonales.Pais,
            Estado: response.DatosPersonales.Estado,
            Municipio: response.DatosPersonales.Municipio,
            Localidad: response.DatosPersonales.Localidad,
            Direccion: response.DatosPersonales.Direccion,
            Sucursal: response.DatosPersonales.Sucursal,
            IdDireccion: response.DatosPersonales.IdDireccion,
          },
          DatosIncidencia: {
            IdIncidencia: response.DatosIncidencia.IdIncidencia,
            Acuerdo: response.DatosIncidencia.Acuerdo,
            Categoria: response.DatosIncidencia.Categoria,
            Compromiso: response.DatosIncidencia.Compromiso,
            DescripcionIncidencia: response.DatosIncidencia.DescripcionIncidencia,
            Estatus: response.DatosIncidencia.Estatus,
            FechaFin: response.DatosIncidencia.FechaFin,
            FechaInicio: response.DatosIncidencia.FechaInicio,
            Folio: response.DatosIncidencia.Folio,
            HoraFin: response.DatosIncidencia.HoraFin,
            HoraInicio: response.DatosIncidencia.HoraInicio,
            Prioridad: response.DatosIncidencia.Prioridad,
            Responsable: response.DatosIncidencia.Responsable,
            AnalisisOrigen: response.DatosIncidencia.AnalisisOrigen,
            MotivoLlamada: response.DatosIncidencia.MotivoLlamada,
            Satisfaccion: response.DatosIncidencia.Satisfaccion,
            Caso: response.DatosIncidencia.Caso,
            //TipoHomologacion: response.DatosIncidencia.TipoHomologacion,
            Homologacion: response.DatosIncidencia.Homologacion,
            TipoMotivoAtraso: response.DatosIncidencia.TipoMotivoAtraso,
            MotivoAtraso: response.DatosIncidencia.MotivoAtraso,
            OtraLlamada: response.DatosIncidencia.OtraLlamada
          },
          DatosCredito: {
            Grupo: response.DatosCredito.Grupo,
            Ciclo: response.DatosCredito.Ciclo,
            Oficial: response.DatosCredito.Oficial,
            Sucursal: response.DatosCredito.Sucursal
          }


        });

        const sucursalEncontrada = this.SucursalZonaFina.find(item => item.IdSucursal === response.DatosPersonales.Sucursal);
        this.incidenciaForm.get('DatosPersonales.Sucursal')?.setValue(sucursalEncontrada);
        this.incidenciaForm.get('DatosPersonales.ZonaFinanciera')?.setValue(sucursalEncontrada?.ZonaFinanciera);
        if (response.DatosIncidencia.MotivoLlamada <= 1) {
          this.mostrarHomologacion = true;
        } else {
          this.mostrarHomologacion = false;
        }

        var estatusBuscado = this.Estatus.find(elemento => elemento.IdEstatus === response.DatosIncidencia.Estatus);
        if (estatusBuscado?.Codigo == "FINALIZADO") {
          this.finalizado = true;
        }
        this.noCliente = response.DatosPersonales.NoCliente;

        this.titulo = 'Editar Incidencia' + '    ' + response.DatosIncidencia.Folio;
        this.IdIncidencia = response.DatosIncidencia.IdIncidencia;

        const pais = this.Pais.find(item => item.TAPAICOD == response.DatosPersonales.Pais);
        this.incidenciaForm.patchValue({
          DatosPersonales: {
            Pais: pais?.TAPAINOM
          }
        });

        if (response.DatosIncidencia.OtraLlamada.length > 0) {
          this.readonlyHomologacion = true;
          this.otroTipoLlamada = true;
        } else {
          this.readonlyHomologacion = true;
          this.otroTipoLlamada = false;
        }

        this.isCliente = response.DatosPersonales.EsCliente;
        this.Readonly = response.DatosPersonales.EsCliente;
        this.escliente = response.DatosPersonales.EsCliente;
        const textoBuscarResponsable = response.DatosIncidencia.Responsable.toString().trim();
        //const res = this.Responsables.find(item => item.IdResponsable == response.DatosIncidencia.Responsable);
        const resResponsable = this.Responsables.find(item => item.IdResponsable.trim().includes(textoBuscarResponsable));
        const resCaso = this.CasoCategoria.find(item => item.IdCasoCategoria == response.DatosIncidencia.Caso);
        const resllama = this.LlamadaCategoria.find(item => item.IdLlamadaCategoria == response.DatosIncidencia.MotivoLlamada);
        const homo = this.Homologacion.filter(a => a.IdCasoCategoria === resCaso?.IdCasoCategoria);

        if (homo.length <= 1) {
          this.SelectHomologacion = homo;
          this.readonlyH = true;

          this.incidenciaForm.get('DatosIncidencia.Homologacion')?.setValue(homo[0].IdHomologacionCategoria);

        } else {
          this.readonlyH = false;
          this.SelectHomologacion = homo;
          console.log(this.SelectHomologacion)
        }
        if (resResponsable) {
          this.responsableCtrl.setValue(resResponsable);
        }

        if (resCaso) {
          this.CasoCtrl.setValue(resCaso);
        }

        if (resllama) {
          this.llamadaCtrl.setValue(resllama);
        }

        response.DatosAgenteAsignado?.forEach((element: IAgentesAsigResponse) => {

          const agente = {
            IdAgente: element.IdAgente,
            IdAsignacionEnviada: element.IdAsignacionEnviada,
            IdAsignacionIncidencia: element.IdAsignacionIncidencia,
            NombreAgente: element.NombreAgente,
            Puesto: element.Puesto,
            Email: element.Email,
            Sucursal: element.Sucursal,
            Activo: element.Activo,
            EmailEnviado: element.EmailEnviado,
            TipoEnvio: element.TipoEnvio,
            IdTipoEnvio: element.IdTipoEnvio
          };

          this.AgentesOriginales.push(agente);
          this.dataSource.data = [...this.dataSource.data, agente];

        });

        // this.dataSource.data = this.AgentesOriginales;// [...this.dataSource.data, agente];
        this.Seguimientos = response.DatosSeguimientos?.map((element: ISeguimiento) => ({
          Descripcion: element.Descripcion,
          IdIncidencia: element.IdIncidencia,
          IdSeguimiento: element.IdSeguimiento,
          TipoSeguimiento: element.TipoSeguimiento,
          FechaRegistro: element.FechaRegistro,
          Categoria: element.Categoria,
          Usuario: '',
          Estatus: '',
          Tipo: element.Tipo,
          Registro: element.Registro,
          Reenvio: element.Reenvio
        })) || [];

        this.Verificaciones = response.DatosVerificacion?.map((element: IVerificacion) => ({
          // const verificacion = {
          IdVerificacion: element.IdVerificacion,
          IdIncidencia: element.IdIncidencia,
          DiaVerificacion: element.DiaVerificacion,
          Descripcion: element.Descripcion,
          FechaInicio: element.FechaInicio,
          FechaFin: element.FechaFin,
          Activo: element.Activo,
          UsuarioRegistro: '',

        })) || [];

        response.DatosEvidencias?.forEach((element: IArchivoModel) => {

          if (element.base64) {

            const blob = this.base64ToBlob(element.base64, element.Tipo);

            const blobUrl = window.URL.createObjectURL(blob);

            const nuevoArchivo: IArchivoModel = {
              IdArchivo: element.IdArchivo,
              NombreArchivo: element.NombreArchivo,
              Tipo: element.Tipo,
              Url: blobUrl,
              base64: element.base64,
              FechaSubida: new Date(),
              Activo: element.Activo
            };

            this.ArchivosOriginales.push(nuevoArchivo);
            this.dataSourceFile.data = [...this.dataSourceFile.data, nuevoArchivo];

          }

        });

        const edo = this.Estados.find(item => item.TADEPCOD == response.DatosPersonales.Estado);

        const loc = this.Localidades.find(item => item.TABARCOD == response.DatosPersonales.Localidad);


        if (edo) {
          this.estadoCtrl.setValue(edo);
          this.onEstadoChange(edo);
        }
        if (loc) {
          this.localidadCtrl.setValue(loc);
        }


        this.isLoading = false;

      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 401) {
          this.openSnackBar("No autorizado. Por favor, inicia sesión.");
        } else {

          this.openSnackBar("Error: " + (error.error.message || "Error desconocido"));
        }
      }
    });

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
  readonly panelOpenState = signal<string | null>(null);

  buscarCliente() {
    const dialogRef = this.dialogGeneral.open(BuscarClienteComponent, {
      autoFocus: false,
      minWidth: '90%',
      minHeight: '90%',
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result != "close")
        this.cargarDatosPersonales(result)
    });
  }


  base64ToBlob(base64: string, type = 'application/octet-stream'): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type });
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
    this.buscar = false;
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
    this.isLoading = false;

    forkJoin({
      categorias: this.methodsService.HttpGet('Categorias/get-categoria', {}).pipe(
        catchError(error => {
          this.openSnackBar(error);
          return of([]);
        })
      ),
      /*TiposEnvios: this.methodsService.HttpGet('Categorias/get-TipoEnvioEmail', {}).pipe(
        catchError(error => {
          this.openSnackBar(error);
          return of([]);
        })
      ),*/
      agentes: this.methodsService.HttpGet('Agentes/get-agentes', {}),
      responsables: this.methodsService.HttpGet('Catalagos/get-responsables', {}),
      tipoSeguimiento: this.methodsService.HttpGet('Catalagos/get-tiposeguimiento', {}),
      pais: this.methodsService.HttpGet('Catalagos/get-pais', {}),
      estados: this.methodsService.HttpGet('Catalagos/get-estados', {}),
      fechaHora: this.methodsService.HttpGet('Catalagos/get-fechaHora', {}),
      prioridades: this.methodsService.HttpGet('Prioridad/get-prioridad', {}),
      tipoMotivoAtraso: this.methodsService.HttpGet('Catalagos/get-tipoMotivoAtraso', {}),
      motivollmada: this.methodsService.HttpGet('Catalagos/get-motivollamada', {}),
      //tipohomologacion: this.methodsService.HttpGet('Catalagos/get-tipohomologacion', {}),
      homologacion: this.methodsService.HttpGet('Catalagos/get-homologacion', {}),
      casocategoria: this.methodsService.HttpGet('Catalagos/get-casocategoria', {}),
      estatus: this.methodsService.HttpGet('Estatus/get-estatus', {}),
      TiposEnvios: this.methodsService.HttpGet('Catalagos/get-TipoEnvioEmail', {}),
      SucursalZona: this.methodsService.HttpGet('Catalagos/get-SucursalZonaFinanciera', {})
    }).subscribe(res => {

      const categorias = res.categorias as ResponseData<ICategoriasResponse[]>;
      const agentes = res.agentes as ResponseData<IAgentesAsigResponse[]>;
      const responsables = res.responsables as ResponseData<IResponsablesResponse[]>;
      const tipoSeguimiento = res.tipoSeguimiento as ResponseData<ITipoSeguimientoResponse[]>;
      const pais = res.pais as ResponseData<IPais[]>;
      const estados = res.estados as ResponseData<IEstados[]>;
      const fechaHora = res.fechaHora as ResponseData<IFechaHora[]>;
      const prioridades = res.prioridades as ResponseData<IPrioridadResponse[]>;
      const tipoMotivoAtraso = res.tipoMotivoAtraso as ResponseData<ITipoMotivoAtrasoResponse[]>;
      const motivollmada = res.motivollmada as ResponseData<ILlamadaCategoriaResponse[]>;
      //const tipohomologacion = res.tipohomologacion as ResponseData<ITipoHomologacionResponse[]>;
      const homologacion = res.homologacion as ResponseData<IHomologacionResponse[]>;
      const casocategoria = res.casocategoria as ResponseData<ICasoCategoriaResponse[]>;

      const estatus = res.estatus as ResponseData<IEstatusResponse[]>;
      const tiposEnvios = res.TiposEnvios as ResponseData<ITipoEnvioEmailResponse[]>;
      const sucursalZona = res.SucursalZona as ResponseData<ISucursalZonaFinanciera[]>;

      this.Categorias = categorias.data;
      this.AgentesAsignado = agentes.data;
      this.Responsables = responsables.data;
      this.TipoSeguimiento = tipoSeguimiento.data;
      this.Pais = pais.data;
      this.Estados = estados.data;
      this.FechaHora = fechaHora.data;
      this.Prioridades = prioridades.data;
      this.TipoMotivoAtraso = tipoMotivoAtraso.data;
      this.LlamadaCategoria = motivollmada.data;
      //this.TipoHomologacion = tipohomologacion.data;
      this.Homologacion = homologacion.data;
      this.CasoCategoria = casocategoria.data;
      this.Estatus = estatus.data;
      this.TipoEnvioEmail = tiposEnvios.data;
      this.SucursalZonaFina = sucursalZona.data;

      this.cargarDatosIncidencia();

    });


  }

  onCasoCategoriaChange(caso: ICasoCategoriaResponse) {


    //var IdTipoHomologacionCategoria = caso.IdTipoHomologacionCategoria;
    var IdHomologacionCategoria = caso.IdHomologacionCategoria;
    var IdCaso = caso.IdCasoCategoria;
    const homo = this.Homologacion.filter(a => a.IdCasoCategoria === IdCaso);
    console.log(homo)
    if (homo.length <= 1) {
      this.SelectHomologacion = homo;
      this.readonlyH = true;
      if (IdHomologacionCategoria == 1) {
        this.mostrarHomologacion = true;
      }
      else {
        this.mostrarHomologacion = false;
      }
      console.log(homo[0].IdHomologacionCategoria
      )
      this.incidenciaForm.get('DatosIncidencia.Homologacion')?.setValue(homo[0].IdHomologacionCategoria);

    } else {
      console.log(this.SelectHomologacion)
      this.readonlyH = false;
      this.SelectHomologacion = homo;
      console.log(this.SelectHomologacion)
    }


  }


  onSelectionAgentesAsignados(responsable: IResponsables) {
    this.puesto = responsable.Puesto;
    this.sucursal = responsable.Sucursal
    this.email = responsable.Email;
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

    this.incidenciaForm.patchValue({
      DatosPersonales: {
        Estado: estado.TADEPNOM
      }
    });

    this.methodsService.HttpGet('Catalagos/get-municipios', { TADEPCOD: estado.TADEPCOD }).subscribe({
      next: (response: ResponseData<IMunicipios[]>) => {
        this.Municipios = response.data;


        const mun = this.incidenciaForm.get('DatosPersonales.Municipio')?.value;

        const muni = this.Municipios.find(item => item.TAMUNCOD == mun);

        if (muni) {
          this.municipioCtrl.setValue(muni);
          this.onMunicipioChange(muni);
        }
        this.isLoading = false;
      }, error: () => {
        this.isLoading = false;
      }
    });

  }

  onMunicipioChange(municipio: IMunicipios) {

    this.Localidades = [];
    this.localidadCtrl.setValue(null);
    this.localidadCtrl.updateValueAndValidity();
    this.municipioSeleccionado = municipio.TAMUNCOD;

    this.incidenciaForm.patchValue({
      DatosPersonales: {
        Municipio: municipio.TAMUNNOM
      }
    });

    this.methodsService.HttpGet('Catalagos/get-localidades', { TAMUNCOD: municipio.TAMUNCOD, TADEPCOD: this.estadoSeleccionado }).subscribe({
      next: (response: ResponseData<ILocalidades[]>) => {

        this.Localidades = response.data;

        const loc = this.incidenciaForm.get('DatosPersonales.Localidad')?.value;

        const loca = this.Localidades.find(item => item.TABARCOD == loc);

        if (loca) {
          this.localidadCtrl.setValue(loca);
          this.onLocalidadChange(loca);
        }

        this.localidadCtrl.updateValueAndValidity();
        this.isLoading = false;
      }, error: () => {
        this.isLoading = false;
      }
    });

  }

  onLocalidadChange(localidad: ILocalidades) {

    this.incidenciaForm.patchValue({
      DatosPersonales: {
        Localidad: localidad.TABARNOM
      }
    });

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
      base64: '',
      Activo: true
    };

    this.dataSourceFile.data = [...this.dataSourceFile.data, nuevoArchivo];
    event.target.value = '';
  }

  removeAgenteData(data: any) {

    const index = this.dataSource.data.findIndex(item => item.IdAgente == data.IdAgente)

    if (index !== -1) {
      if (this.dataSource.data[index]?.IdAsignacionIncidencia > 0) {
        const indexOrigin = this.AgentesOriginales.findIndex(item => item.IdAsignacionIncidencia == this.dataSource.data[index].IdAsignacionIncidencia);

        if (indexOrigin !== -1) {
          this.AgentesOriginales[indexOrigin].Activo = false;

        }


        this.dataSource.data.splice(index, 1);

        this.dataSource.data = [...this.dataSource.data];
      }

    }

  }

  verFile(archivo: IArchivoModel) {
    this.dialogGeneral.open(VisorArchivoComponent, {
      data: archivo,
      autoFocus: false,
      minWidth: '90%',
      minHeight: '90%',
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });

  }

  removeFile(data: any) {

    const index = this.dataSourceFile.data.findIndex(item => item.NombreArchivo == data.NombreArchivo)

    if (index !== -1) {


      if (this.dataSourceFile.data[index]?.IdArchivo > 0) {

        this.ArchivosOriginales[index].Activo = false;

      }

      this.dataSourceFile.data.splice(index, 1);

      this.dataSourceFile.data = [...this.dataSourceFile.data];

    }


  }


  descargarFile(data: any) {
    // 1. Validar que tengamos el contenido base64
    if (!data || !data.base64) {
      this.openSnackBar("El archivo no se ha sido registrado hay que guardar para poder descargar");
      return;
    }

    try {
      // 2. Limpiar prefijos si existen
      const base64Data = data.base64.includes(',')
        ? data.base64.split(',')[1]
        : data.base64;

      // 3. Convertir Base64 a Bytes puros
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // 4. Crear el Blob usando el "Tipo" que ya viene en tu objeto (ej: 'application/pdf')
      const blobReal = new Blob([byteArray], { type: data.Tipo || 'application/octet-stream' });
      const blobUrl = window.URL.createObjectURL(blobReal);

      // 5. Crear el enlace oculto y forzar la descarga con su nombre real
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = data.NombreArchivo || 'archivo_descargado'; // Usa tu propiedad NombreArchivo

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 6. Limpiar memoria
      window.URL.revokeObjectURL(blobUrl);

    } catch (error) {
      this.openSnackBar('Error al procesar la descarga desde Base64');
    }
  }

  guardarAgente() {

    const agente = this.agenteAsignadoCtrl.value;

    if (agente != null) {
      const index = this.dataSource.data.findIndex(item => item.IdAgente == agente.IdAgente)
      if (index !== -1) {
        this.openSnackBar("El responsable ya esta asignado");
      } else {
        agente.IdAsignacionEnviada = 0;
        agente.IdAsignacionIncidencia = 0;
        agente.Activo = true;

        const idSeleccionado = this.agentesForm.get('TipoEnvio')?.value;

        // 2. Buscas el objeto completo en tu lista
        const tipoEnvioEncontrado = this.TipoEnvioEmail.find(t => t.IdTipoEnvio === idSeleccionado);

        // 3. ¡Aquí tienes el texto/código listo!
        const textoTipoEnvio = tipoEnvioEncontrado ? tipoEnvioEncontrado.Codigo : '';


        var agenteAsigndo = {
          IdAgente: agente.IdAgente,
          IdAsignacionEnviada: agente.IdAsignacionEnviada,
          IdAsignacionIncidencia: agente.IdAsignacionIncidencia,
          NombreAgente: agente.NombreAgente,
          Puesto: agente.Puesto,
          Sucursal: agente.Sucursal,
          Email: agente.Email,
          Activo: agente.Activo,
          EmailEnviado: agente.EmailEnviado,
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
            IdSeguimiento: 0,
            IdIncidencia: this.IdIncidencia,
            TipoSeguimiento: result.TipoSeguimiento,
            Reenvio: result.Reenvio,
            FechaRegistro: new Date,// this.FechaHora[0].fechaInicio + ' ' + this.FechaHora[0].horaInicio,
            Descripcion: result.Descripcion,
            Categoria: categoria == null ? '' : categoria.Codigo,
            Estatus: estatus == null ? '' : estatus.Codigo,
            Usuario: this.creadoPor,
            Tipo: estatus == null ? '' : estatus.Codigo,
            Registro: this.creadoPor
          };
          this.Seguimientos.push(seguimiento);

        }


        /* else
           this.limpiarDatosPersonales();*/
      });
    } else {
      this.openSnackBar("Para agregar seguimientos debe completar la Seccion Datos Incidencia");
    }



  }

  agregarVerificacion() {
    const dialogRef = this.dialogGeneral.open(VerificacionComponent, {
      autoFocus: false,
      minWidth: '85%',
      minHeight: '40%',
      disableClose: true,
      panelClass: 'custom-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result != 'close') {
        /*  if (this.Verificaciones.length <= 3) {*/
        const verificacion = {
          IdVerificacion: 0,
          IdIncidencia: 0,
          DiaVerificacion: this.Verificaciones.length + 1,
          Descripcion: result.Descripcion,
          FechaInicio: result.FechaInicio,
          FechaFin: result.FechaFin,
          Activo: true,
          UsuarioRegistro: this.creadoPor
        }
        this.Verificaciones.push(verificacion);
      }
    });
  }

  reenviarEmail(data: any) {

    var reenviar = {
      IdIncidencia: this.IdIncidencia,
      IdAsignacionEnviada: data.IdAsignacionEnviada
    };
    this.methodsService.HttpPost('Incidencia/get-incidencia-reenviarEmail', {}, reenviar).subscribe({
      next: (response) => {

        this.openSnackBar("El Email Fue Enviado Exitosamente!!");
        this.closeDialog();
        this.isLoading = false;
      }, error: () => {
        this.isLoading = false;
      }
    });
  }

  onSelectionChangeSucursal(event: any) {
    this.incidenciaForm.get('DatosPersonales.ZonaFinanciera')?.setValue(event.value.ZonaFinanciera);

  }
  closeDialog() {
    this.dialog.close('close');
  }

  closeDialogEditar() {
    this.dialog.close('success');
  }


}
