import { inject, Injectable } from '@angular/core';
import { almacenamientoSesion } from '../puertos/almacenamientoSesion';

/**
 * Caso de uso: cerrar sesión.
 */
@Injectable({ providedIn: 'root' })
export class cerrarSesion
{
    private readonly almacenamiento = inject(almacenamientoSesion);

    ejecutar(): void
    {
        this.almacenamiento.eliminar();
    }
}
