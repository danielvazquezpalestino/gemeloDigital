/**
 * Flujo de caja de un año dentro de la estimación financiera.
 */
export class flujoFinancieroAnual
{
    constructor
    (
        public readonly anio: number,
        public readonly flujoNeto: number,
        public readonly flujoDescontado: number,
        public readonly acumulado: number,
    )
    {
    }
}
