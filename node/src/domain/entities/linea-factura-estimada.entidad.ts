/**
 * Una línea del desglose de la factura estimada.
 */
class LineaFacturaEstimada
{
    constructor(
        public readonly concepto: string,
        public readonly cantidadKwh: number,
        public readonly precioKwh: number,
        public readonly subtotal: number,
    )
    {
    }
}

export = LineaFacturaEstimada;
