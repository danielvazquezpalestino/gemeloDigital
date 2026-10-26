/**
 * Error de dominio de autenticación.
 *
 * La infraestructura traduce los errores HTTP a esta clase para que la
 * presentación no conozca detalles del transporte.
 */
export class errorAutenticacion extends Error
{
    constructor(mensaje: string)
    {
        super(mensaje);
        this.name = 'errorAutenticacion';

        // Restaura la cadena de prototipos para que `instanceof` funcione
        // aunque el destino de compilación sea anterior a ES6.
        Object.setPrototypeOf(this, errorAutenticacion.prototype);
    }
}
