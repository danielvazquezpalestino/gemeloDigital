import { Routes } from '@angular/router';
import { rutasAutenticacion } from './presentacion/funcionalidades/autenticacion/autenticacion.rutas';
import { rutasInicio } from './presentacion/funcionalidades/inicio/inicio.rutas';

/**
 * Rutas raíz de la aplicación. Cada funcionalidad aporta sus propias rutas.
 */
export const routes: Routes = [
    ...rutasAutenticacion,
    ...rutasInicio,
    { path: '', pathMatch: 'full', redirectTo: 'iniciar-sesion' },
    { path: '**', redirectTo: 'iniciar-sesion' },
];
