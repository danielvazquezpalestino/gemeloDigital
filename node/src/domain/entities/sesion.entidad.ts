import Usuario = require('./usuario.entidad');

/**
 * Sesión emitida tras validar las credenciales de un usuario.
 */
class Sesion
{
    constructor
    (
        public readonly usuario: Usuario,
        public readonly token: string,
        public readonly expiraEnSegundos: number,
    )
    {
    }
}

export = Sesion;
