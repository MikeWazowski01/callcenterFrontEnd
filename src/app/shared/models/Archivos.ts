export interface IArchivoModel {
    IdArchivo: number,
    NombreArchivo: string;
    Tipo: string;
    Archivo?: File;
    Url: string;
    FechaSubida: Date;
    base64?: string;
    Activo: boolean;
}