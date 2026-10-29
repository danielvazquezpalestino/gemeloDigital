import { Routes } from '@angular/router';

/**
 * Rutas de la sección de simulaciones (hijas del panel).
 */
export const rutasSimulaciones: Routes = [
    {
        path: 'simulaciones',
        title: 'Simulaciones | Gemelo Digital',
        loadComponent: () =>
            import('./paginaSimulaciones').then((modulo) => modulo.paginaSimulaciones),
    },
];
