/**
 * Error de dominio para las respuestas de la API.
 *
 * La infraestructura traduce los errores HTTP a esta clase; la presentación
 * solo recibe un mensaje en español y, si existe, el código HTTP original.
 */
export class errorApi extends Error
{
    constructor(
        mensaje: string,
        public readonly codigoEstado: number | null = null,
    )
    {
        super(mensaje);
        this.name = 'errorApi';

        // Restaura la cadena de prototipos para que `instanceof` funcione
        // aunque el destino de compilación sea anterior a ES6.
        Object.setPrototypeOf(this, errorApi.prototype);
    }
}
