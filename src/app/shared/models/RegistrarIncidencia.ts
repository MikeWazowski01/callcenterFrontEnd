
export interface IRegistrarIncidencia {
     DatosPersonales: IDatosPersonales;
     DatosCredito: IDatosCredito;
     DatosIncidencia: IDatosIncidencia;
     Seguimientos: ISeguimientos[];

}

export interface IDatosIncidencia {
     IdCategoria: number;
     IdPrioridad: number;
     IdAgente: number;
     IdEstatus: number;
     Incidencia: string;
     Solucion: string;
     Compromiso: string;
}

export interface IDatosPersonales {
     NoCliente: string;
     Nombre: string;
     ApellidoPaterno: string;
     ApellidoMaterno: string;
     INE: string;
     FechaNacimiento: Date;
     Telefono: string;
     Curp: string;
     Pais: string;
     Estado: string;
     Municipio: string;
     Localidad: string;
     Direccion: string;
     EsCliente: boolean;
}

export interface IDatosCredito {
     grupo: string;
     ciclo: string;
     oficial: string;
     sucursal: string;
}

export interface ISeguimientos {
     Seguimiento: string;
     FechaRegistro: Date;
}

