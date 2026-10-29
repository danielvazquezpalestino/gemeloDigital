import { Routes } from '@angular/router';

/**
 * Rutas de la sección de incentivos (hijas del panel).
 */
export const rutasIncentivos: Routes = [
    {
        path: 'incentivos',
        title: 'Incentivos | Gemelo Digital',
        loadComponent: () => import('./paginaIncentivos').then((modulo) => modulo.paginaIncentivos),
    },
];
