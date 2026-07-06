export interface IMenus {
     IdMenu: number,
     NombreMenu: string,
     Ruta: string,
     Icon: string,
     Orden: number,
     IdMenuPadre: number | null,
     Permisos: string,
     SubMenus: IMenus[]
}

export interface IMenusPermisos {
     IdMenu: number,
     NombreMenu: string,
     Ruta: string,
     Icon: string,
     Orden: number,
     IdMenuPadre: number | null,
     Permisos: string[],
     SubMenus: IMenus[]
}

export interface ISubMenus {
     IdMenu: number,
     NombreMenu: string,
     Ruta: string,
     Icon: string,
     Orden: 1,
     IdMenuPadre: number,
     Permisos: string

}

export interface IMenuResponse {
     data: IMenus[];
     message: string;
     showMessage: boolean
}