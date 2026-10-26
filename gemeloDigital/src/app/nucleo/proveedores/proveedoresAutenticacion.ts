import { Provider } from '@angular/core';
import { almacenamientoSesion } from '../../aplicacion/puertos/almacenamientoSesion';
import { almacenamientoSesionLocal } from '../../infraestructura/almacenamiento/almacenamientoSesionLocal';
import { repositorioAutenticacion } from '../../aplicacion/puertos/repositorioAutenticacion';
import { repositorioAutenticacionHttp } from '../../infraestructura/repositorios/repositorioAutenticacionHttp';

/**
 * Cableado puerto -> adaptador para la funcionalidad de autenticación.
 */
export const proveedoresAutenticacion: Provider[] = [
    { provide: repositorioAutenticacion, useClass: repositorioAutenticacionHttp },
    { provide: almacenamientoSesion, useClass: almacenamientoSesionLocal },
];
