import ValidacionEntrada = require('../validacion-entrada');

/**
 * Datos de entrada para registrar un usuario.
 *
 * Obligatorios: `nombre`, `correo` y `contrasenia`. El correo se normaliza a
 * minúsculas; la contraseña exige al menos 8 caracteres.
 */
class DtoRegistroUsuario
{
    private constructor
    (
        public readonly nombre: string,
        public readonly correo: string,
        public readonly contrasenia: string,
    )
    {
    }

    static crear(datos: unknown): [string | undefined, DtoRegistroUsuario | undefined]
    {
        const objeto = ValidacionEntrada.comoObjeto(datos);

        if (!objeto)
        {
            return ['Los datos de registro son inválidos', undefined];
        }

        const [errorNombre, nombre] = ValidacionEntrada.leerTextoRequerido(objeto['nombre'], 'nombre', 100);

        if (errorNombre || nombre === undefined)
        {
            return [errorNombre ?? 'El nombre es obligatorio', undefined];
        }

        const [errorCorreo, correo] = DtoRegistroUsuario.leerCorreo(objeto['correo']);

        if (errorCorreo || correo === undefined)
        {
            return [errorCorreo ?? 'El correo electrónico es obligatorio', undefined];
        }

        const [errorContrasenia, contrasenia] = DtoRegistroUsuario.leerContrasenia(objeto['contrasenia']);

        if (errorContrasenia || contrasenia === undefined)
        {
            return [errorContrasenia ?? 'La contraseña es obligatoria', undefined];
        }

        return [undefined, new DtoRegistroUsuario(nombre, correo, contrasenia)];
    }

    private static leerCorreo(valor: unknown): [string | undefined, string | undefined]
    {
        const [error, correo] = ValidacionEntrada.leerTextoRequerido(valor, 'correo', 150);

        if (error || correo === undefined)
        {
            return [error ?? 'El correo electrónico es obligatorio', undefined];
        }

        const normalizado = correo.toLowerCase();

        // Comprobación deliberadamente laxa: el objetivo es rechazar textos que
        // claramente no son correos, no duplicar la validación completa de RFC.
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizado))
        {
            return ['El correo electrónico no tiene un formato válido', undefined];
        }

        return [undefined, normalizado];
    }

    private static leerContrasenia(valor: unknown): [string | undefined, string | undefined]
    {
        if (typeof valor !== 'string' || valor === '')
        {
            return ['La contraseña es obligatoria', undefined];
        }

        if (valor.length < 8)
        {
            return ['La contraseña debe tener al menos 8 caracteres', undefined];
        }

        if (valor.length > 128)
        {
            return ['La contraseña no puede superar 128 caracteres', undefined];
        }

        return [undefined, valor];
    }
}

export = DtoRegistroUsuario;
