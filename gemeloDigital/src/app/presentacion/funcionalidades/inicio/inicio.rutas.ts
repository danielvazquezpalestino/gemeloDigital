import { Routes } from '@angular/router';

/**
 * Ruta de la página de inicio del panel.
 *
 * Es una ruta hija del armazón compartido, por eso su `path` es vacío.
 */
export const rutasInicio: Routes = [
    {
        path: '',
        title: 'Panel | Gemelo Digital',
        loadComponent: () => import('./panelInicio').then((modulo) => modulo.panelInicio),
    },
];
