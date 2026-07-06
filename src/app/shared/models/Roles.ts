export interface IRoles {
    IdRol: number;
    NombreRol: string;
    FechaRegistro: Date;
    EstatusNombre: string;
    Estatus: number;
}

export interface IRolMenus {
    IdMenu: number,
    NombreMenu: string,
    Ruta: string,
    Icon: string,
    Orden: number,
    IdMenuPadre: number | null,
    Permisos: string,
    RolPermiso: IRolPermiso[]
    SubMenus: IRolMenus[]
}

export interface IRolSubMenus {
    IdMenu: number,
    NombreMenu: string,
    Ruta: string,
    Icon: string,
    Orden: 1,
    IdMenuPadre: number,
    Permisos: string

}

export interface IRolPermiso {
    Permiso: number;
}

export interface IRolMenuResponse {
    data: IRolMenus[];
    message: string;
    showMessage: boolean
}