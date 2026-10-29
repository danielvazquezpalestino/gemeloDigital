/**
 * Bloque de consumo de una tarifa eléctrica.
 *
 * `hastaKwh` es nulo en el último bloque, que no tiene límite superior.
 */
export class bloqueConsumoTarifa
{
    constructor
    (
        public readonly hastaKwh: number | null,
        public readonly precioKwh: number,
    )
    {
    }
}
