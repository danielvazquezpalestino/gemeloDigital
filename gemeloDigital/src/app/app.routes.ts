import { Routes } from '@angular/router';
import { rutasAutenticacion } from './presentacion/funcionalidades/autenticacion/autenticacion.rutas';
import { rutasPanel } from './presentacion/compartido/diseno/panel.rutas';

/**
 * Rutas raíz de la aplicación. Cada funcionalidad aporta sus propias rutas.
 */
export const routes: Routes = [
    ...rutasAutenticacion,
    ...rutasPanel,
    { path: '', pathMatch: 'full', redirectTo: 'iniciar-sesion' },
    { path: '**', redirectTo: 'iniciar-sesion' },
];
