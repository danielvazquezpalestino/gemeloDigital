import { Routes } from '@angular/router';
import { autenticacionGuardia } from '../../funcionalidades/autenticacion/autenticacion.guardia';
import { rutasClima } from '../../funcionalidades/clima/clima.rutas';
import { rutasFinanciero } from '../../funcionalidades/financiero/financiero.rutas';
import { rutasIncentivos } from '../../funcionalidades/incentivos/incentivos.rutas';
import { rutasInicio } from '../../funcionalidades/inicio/inicio.rutas';
import { rutasProduccionSolar } from '../../funcionalidades/produccionSolar/produccionSolar.rutas';
import { rutasSimulaciones } from '../../funcionalidades/simulaciones/simulaciones.rutas';
import { rutasTarifas } from '../../funcionalidades/tarifas/tarifas.rutas';

/**
 * Ruta del panel autenticado.
 *
 * El armazón (barra lateral + encabezado) se carga una sola vez y las páginas
 * de cada sección se anidan dentro de él, para que la navegación no se
 * reconstruya en cada cambio de módulo.
 */
export const rutasPanel: Routes = [
    {
        path: 'panel',
        canActivate: [autenticacionGuardia],
        loadComponent: () =>
            import('./disenoPrincipal').then((modulo) => modulo.disenoPrincipal),
        children: [
            ...rutasInicio,
            ...rutasProduccionSolar,
            ...rutasClima,
            ...rutasTarifas,
            ...rutasIncentivos,
            ...rutasFinanciero,
            ...rutasSimulaciones,
            { path: '**', redirectTo: '' },
        ],
    },
];
