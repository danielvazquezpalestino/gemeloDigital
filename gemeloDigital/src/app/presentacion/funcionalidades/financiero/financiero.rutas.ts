import { Routes } from '@angular/router';

/**
 * Rutas de la sección financiera (hijas del panel).
 */
export const rutasFinanciero: Routes = [
    {
        path: 'financiero',
        title: 'Financiero | Gemelo Digital',
        loadComponent: () => import('./paginaFinanciero').then((modulo) => modulo.paginaFinanciero),
    },
];
