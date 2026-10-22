/**
 * Jerarquía de errores de negocio de la API.
 *
 * El controlador traduce estas excepciones a respuestas con el formato
 * `{ "mensaje": "..." }`, sin filtrar detalles internos al cliente.
 */
class ErrorPersonalizado extends Error
{
    constructor(mensaje: string, public readonly codigoEstado: number)
    {
        super(mensaje);
        this.name = 'ErrorPersonalizado';

        // Restaura la cadena de prototipos para que `instanceof` funcione
        // aunque el proyecto se compile a un destino anterior a ES6.
        Object.setPrototypeOf(this, ErrorPersonalizado.prototype);
    }

    static peticionIncorrecta(mensaje: string): ErrorPersonalizado
    {
        return new ErrorPersonalizado(mensaje, 400);
    }

    static noAutorizado(mensaje: string): ErrorPersonalizado
    {
        return new ErrorPersonalizado(mensaje, 401);
    }

    static prohibido(mensaje: string): ErrorPersonalizado
    {
        return new ErrorPersonalizado(mensaje, 403);
    }

    static noEncontrado(mensaje: string): ErrorPersonalizado
    {
        return new ErrorPersonalizado(mensaje, 404);
    }

    static errorInterno(mensaje: string = 'Error interno del servidor'): ErrorPersonalizado
    {
        return new ErrorPersonalizado(mensaje, 500);
    }
}

export = ErrorPersonalizado;
