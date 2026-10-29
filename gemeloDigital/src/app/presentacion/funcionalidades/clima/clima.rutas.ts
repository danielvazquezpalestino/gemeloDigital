import { Routes } from '@angular/router';

/**
 * Rutas de la sección de clima (hijas del panel).
 */
export const rutasClima: Routes = [
    {
        path: 'clima',
        title: 'Clima | Gemelo Digital',
        loadComponent: () => import('./paginaClima').then((modulo) => modulo.paginaClima),
    },
];
