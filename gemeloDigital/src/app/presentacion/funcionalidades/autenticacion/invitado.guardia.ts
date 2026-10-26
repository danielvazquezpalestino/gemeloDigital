import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { almacenamientoSesion } from '../../../aplicacion/puertos/almacenamientoSesion';

/**
 * Evita que un usuario ya autenticado vuelva al formulario de acceso.
 */
export const invitadoGuardia: CanActivateFn = () =>
{
    const almacenamiento = inject(almacenamientoSesion);
    const enrutador = inject(Router);

    return almacenamiento.estaAutenticado()
        ? enrutador.createUrlTree(['/panel'])
        : true;
};
