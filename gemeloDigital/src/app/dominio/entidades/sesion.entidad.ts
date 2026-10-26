import { usuario } from './usuario.entidad';

/**
 * Sesión emitida por el backend tras validar las credenciales.
 */
export class sesion
{
    constructor
    (
        public readonly usuario: usuario,
        public readonly token: string,
        public readonly expiraEnSegundos: number,
    )
    {
    }
}
