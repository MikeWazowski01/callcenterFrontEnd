import { bootstrapApplication } from '@angular/platform-browser';
export interface IEstatusResponse {
  IdEstatus: number;
  Codigo: string;
}

export interface IPrioridadResponse {
  IdPrioridad: number;
  Codigo: string;
}

export interface ITipoMotivoAtrasoResponse {
  IdTipoMotivoAtraso: number;
  Codigo: string;
}

export interface ICategoriasResponse {
  IdCategoria: number;
  Codigo: string;
}

export interface IAgentesResponse {
  IdAgente: string;
  NombreAgente: string;
}

export interface IResponsablesResponse {
  IdResponsable: string;
  NombreResponsable: string;
  Email: string;
}

export interface ITipoEnvioEmailResponse {
  IdTipoEnvio: number;
  Codigo: string;
}

export interface IAgentesAsignadosResponse {
  IdAgente: string;
  NombreAgente: string;
  Puesto: string;
  Email: string;
  Sucursal: string;
  TipoEnvio: string;
  IdTipoEnvio?: number;
}

export interface IAgentesAsigResponse {
  IdAgente: string;
  IdAsignacionEnviada: number;
  IdAsignacionIncidencia: number;
  NombreAgente: string;
  Puesto: string;
  Sucursal: string;
  Email: string;
  Activo: boolean;
  EmailEnviado: boolean;
  TipoEnvio: string;
  IdTipoEnvio?: number;
}

export interface ITipoSeguimientoResponse {
  IdTipoSeguimiento: number;
  Descripcion: string;
}
export interface IPais {
  TAPAICOD: string;
  TAPAINOM: string;
}

export interface IEstados {
  TADEPCOD: string;
  TADEPNOM: string;
}

export interface IMunicipios {
  TAMUNCOD: string;
  TAMUNNOM: string;
}

export interface ILocalidades {
  TABARCOD: string;
  TABARNOM: string;
}

export interface IOficinas {
  PAAGECOD: string;
  PAAGENOM: string;
  PAAGECMA: string;
}

export interface IFechaHora {
  fechaInicio: string;
  horaInicio: string;
  fechaFin: string;
  horaFin: string;
}

export interface ISucursalZonaFinanciera {
  IdSucursal: string;
  Sucursal: string;
  ZonaFinanciera: string;
}
export interface IRolesUsuario {
  IdRol: number;
  NombreRol: string;
}

export interface ILlamadaCategoriaResponse {
  IdLlamadaCategoria: number;
  Codigo: string;
}

export interface ITipoHomologacionResponse {
  IdTipoHomologacionCategoria: number;
  Codigo: string;
}

export interface IHomologacionResponse {
  IdHomologacionCategoria: number;
  IdLlamadaCategoria: number;
 IdCasoCategoria: number;
  Codigo: string;
}

export interface ICasoCategoriaResponse {
  IdCasoCategoria: number;
  IdLlamadaCategoria: number;
  //IdTipoHomologacionCategoria: number;
  IdHomologacionCategoria: number;
  Codigo: string;
}


