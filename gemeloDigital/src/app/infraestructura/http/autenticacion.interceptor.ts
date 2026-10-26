import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { almacenamientoSesion } from '../../aplicacion/puertos/almacenamientoSesion';

/**
 * Añade el token de la sesión a las peticiones salientes.
 */
export const autenticacionInterceptor: HttpInterceptorFn = (solicitud, siguiente) =>
{
    const token = inject(almacenamientoSesion).obtenerToken();

    if (!token)
    {
        return siguiente(solicitud);
    }

    return siguiente(solicitud.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
    }));
};
