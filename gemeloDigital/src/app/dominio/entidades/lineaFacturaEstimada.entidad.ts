/**
 * Línea del desglose de una factura eléctrica estimada.
 */
export class lineaFacturaEstimada
{
    constructor
    (
        public readonly concepto: string,
        public readonly cantidadKwh: number,
        public readonly precioKwh: number,
        public readonly subtotal: number,
    )
    {
    }
}
