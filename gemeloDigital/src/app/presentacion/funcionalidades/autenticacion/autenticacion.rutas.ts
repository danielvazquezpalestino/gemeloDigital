import { Routes } from '@angular/router';
import { invitadoGuardia } from './invitado.guardia';

/**
 * Rutas de la funcionalidad de autenticación.
 */
export const rutasAutenticacion: Routes = [
    {
        path: 'iniciar-sesion',
        title: 'Iniciar sesión | Gemelo Digital',
        canActivate: [invitadoGuardia],
        loadComponent: () => import('./iniciarSesion/iniciarSesion').then((modulo) => modulo.iniciarSesion),
    },
];
