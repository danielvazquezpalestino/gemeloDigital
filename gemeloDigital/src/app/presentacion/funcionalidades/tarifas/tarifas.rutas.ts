import { Routes } from '@angular/router';

/**
 * Rutas de la sección de tarifas y consumo (hijas del panel).
 */
export const rutasTarifas: Routes = [
    {
        path: 'tarifas',
        title: 'Tarifas y consumo | Gemelo Digital',
        loadComponent: () => import('./paginaTarifas').then((modulo) => modulo.paginaTarifas),
    },
];
