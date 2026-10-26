import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { almacenamientoSesion } from '../../../aplicacion/puertos/almacenamientoSesion';

/**
 * Permite el acceso solo si hay una sesión vigente.
 */
export const autenticacionGuardia: CanActivateFn = () =>
{
    const almacenamiento = inject(almacenamientoSesion);
    const enrutador = inject(Router);

    return almacenamiento.estaAutenticado()
        ? true
        : enrutador.createUrlTree(['/iniciar-sesion']);
};
