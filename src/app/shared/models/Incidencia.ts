
export interface IIncidencia {
    IdIncidencia: string;
    NoCliente: number,
    Persona: string;
    EsCliente: boolean,
    Folio: string,
    IncidenciaDetalle: string,
    FechaInicio: Date,
    FechaFin: Date,
    Da: number,
    IdResponsable: string,
    NombrNombreResponsableeAgente: string,
    Prioridad: string,
    idPrioridad: number,
    Estatus: string,
    IdEstatus: number,
    Categoria: string
}

export interface DatosGraficaIncidencia {
    Fecha: Date;
    Dia: number;
    Mes: string;
    Estatus: string;
    Total: number;
}