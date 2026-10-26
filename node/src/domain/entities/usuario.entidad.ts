/**
 * Usuario autenticable del gemelo digital.
 *
 * `contraseniaCifrada` contiene únicamente el hash generado por
 * `Contrasenia.cifrar`; nunca debe exponerse en una respuesta HTTP.
 */
class Usuario
{
    constructor
    (
        public readonly id: number,
        public readonly nombre: string,
        public readonly correo: string,
        public readonly contraseniaCifrada: string,
        public readonly roles: readonly string[],
        public readonly fechaCreacion?: Date,
        public readonly fechaActualizacion?: Date,
    )
    {
    }
}

export = Usuario;
