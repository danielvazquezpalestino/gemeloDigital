/**
 * Bloque de consumo de una tarifa.
 *
 * `hastaKwh` es el tamaño máximo del bloque en kWh; `null` representa el
 * bloque final sin límite. Los precios solo son datos de demostración
 * mientras no exista un catálogo oficial verificado en el proyecto.
 */
class BloqueConsumoTarifa
{
    constructor(
        public readonly hastaKwh: number | null,
        public readonly precioKwh: number,
    )
    {
    }
}

export = BloqueConsumoTarifa;
