import { Routes } from '@angular/router';
import { PrioridadesComponent } from './features/pages/prioridades/prioridades.component';
import { CategoriasComponent } from './features/pages/categorias/categorias.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginRedirectGuard } from './core/guards/login-redirect.guard';
import { DashboardComponent } from './layouts/main-layout/dashboard/dashboard.component';
import { DetalleIncidenciaComponent } from './features/pages/incidencias/detalle-incidencia/detalle-incidencia.component';

export const routes: Routes = [
    {

        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
        canActivate: [LoginRedirectGuard]
    },
    {
        path: 'cambiarpassword',
        loadComponent: () => import('./features/auth/cambiar-password/cambiar-password.component').then(m => m.CambiarPasswordComponent),
        canActivate: [LoginRedirectGuard]
    },
    {
        path: '',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'inicio',
                loadComponent: () => import('./features/pages/home/home.component').then(m => m.HomeComponent),
                canActivate: [AuthGuard]
            },
            {
                path: 'incidencia',
                loadComponent: () => import('./features/pages/incidencias/incidencias.component').then(m => m.IncidenciasComponent),
                canActivate: [AuthGuard]

                // path: 'incidencia', component: IncidenciasComponent
            },
            {
                path: 'editar-incidencia',
                loadComponent: () => import('./features/pages/incidencias/editar-incidencia/editar-incidencia.component').then(m => m.EditarIncidenciaComponent),
                canActivate: [AuthGuard]

                //path: 'nueva-incidencia', component: IncidenciaNuevaComponent
            },
            {
                path: 'nueva-incidencia',
                loadComponent: () => import('./features/pages/incidencias/incidencia-nueva/incidencia-nueva.component').then(m => m.IncidenciaNuevaComponent),
                canActivate: [AuthGuard]

                //path: 'nueva-incidencia', component: IncidenciaNuevaComponent
            },
            {
                path: 'buscar-cliente',
                loadComponent: () => import('./features/pages/incidencias/buscar-cliente/buscar-cliente.component').then(m => m.BuscarClienteComponent),
                canActivate: [AuthGuard]
                // path: 'buscar-cliente', component: BuscarClienteComponent
            },
            {
                path: 'usuario',
                loadComponent: () => import('./features/pages/usuarios/usuarios.component').then(m => m.UsuariosComponent),
                canActivate: [AuthGuard]
                // path: 'buscar-cliente', component: BuscarClienteComponent
            },
            {
                path: 'responsable',
                loadComponent: () => import('./features/pages/responsables/responsables.component').then(m => m.ResponsablesComponent),
                canActivate: [AuthGuard]
            },
            {
                path: 'prioridad',
                loadComponent: () => import('./features/pages/prioridades/prioridades.component').then(m => m.PrioridadesComponent),
                canActivate: [AuthGuard]
            },
            {
                path: 'categoria',
                loadComponent: () => import('./features/pages/categorias/categorias.component').then(m => m.CategoriasComponent),
                canActivate: [AuthGuard]

            },
            {
                path: 'roles',
                loadComponent: () => import('./features/pages/roles/roles.component').then(m => m.RolesComponent),
                canActivate: [AuthGuard]
            },
            {
                path: 'reportes',
                loadComponent: () => import('./features/pages/reportes/reportes.component').then(m => m.ReportesComponent),
                canActivate: [AuthGuard]
            },
            {
                path: 'configuracion',
                loadComponent: () => import('./features/pages/configuracion/configuracion.component').then(m => m.ConfiguracionComponent),
                canActivate: [AuthGuard]
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'home'
            }
        ]
    }
    ,
    {
        path: '**', redirectTo: 'login'
    }
];
