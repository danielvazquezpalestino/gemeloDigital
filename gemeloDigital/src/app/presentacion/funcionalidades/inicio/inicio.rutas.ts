import { Routes } from '@angular/router';
import { autenticacionGuardia } from '../autenticacion/autenticacion.guardia';

/**
 * Rutas de la funcionalidad de inicio (panel protegido).
 */
export const rutasInicio: Routes = [
    {
        path: 'panel',
        title: 'Panel | Gemelo Digital',
        canActivate: [autenticacionGuardia],
        loadComponent: () => import('./panelInicio').then((modulo) => modulo.panelInicio),
    },
];
