
export interface ISeguimiento {
    IdSeguimiento: number;
    IdIncidencia: number,
    FechaRegistro: Date,
    Descripcion: string,
    TipoSeguimiento: number,
    Categoria: string,
    Usuario: string,
    Estatus: string,
    Registro: string,
    Tipo: string,
    Reenvio: boolean
}