import ValidacionEntrada = require('../validacion-entrada');

/**
 * Credenciales de inicio de sesión.
 *
 * El mensaje de validación no distingue entre correo inexistente y contraseña
 * incorrecta para no revelar qué parte falló.
 */
class DtoInicioSesion
{
    private constructor
    (
        public readonly correo: string,
        public readonly contrasenia: string,
    )
    {
    }

    static crear(datos: unknown): [string | undefined, DtoInicioSesion | undefined]
    {
        const objeto = ValidacionEntrada.comoObjeto(datos);

        if (!objeto)
        {
            return ['Las credenciales son inválidas', undefined];
        }

        const [errorCorreo, correo] = ValidacionEntrada.leerTextoRequerido(objeto['correo'], 'correo', 150);

        if (errorCorreo || correo === undefined)
        {
            return [errorCorreo ?? 'El correo electrónico es obligatorio', undefined];
        }

        if (typeof objeto['contrasenia'] !== 'string' || objeto['contrasenia'] === '')
        {
            return ['La contraseña es obligatoria', undefined];
        }

        return [undefined, new DtoInicioSesion(correo.toLowerCase(), objeto['contrasenia'])];
    }
}

export = DtoInicioSesion;
