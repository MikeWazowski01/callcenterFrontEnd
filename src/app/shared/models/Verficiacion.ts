export interface IVerificacion {
  IdVerificacion: number,
  IdIncidencia: number,
  DiaVerificacion: number,
  Descripcion: string,
  FechaInicio: Date,
  FechaFin: Date,
  Activo: boolean,
  UsuarioRegistro: string
}