import { Routes } from '@angular/router';

/**
 * Rutas de la sección de producción solar (hijas del panel).
 */
export const rutasProduccionSolar: Routes = [
    {
        path: 'produccion-solar',
        title: 'Producción solar | Gemelo Digital',
        loadComponent: () =>
            import('./paginaProduccionSolar').then((modulo) => modulo.paginaProduccionSolar),
    },
];
