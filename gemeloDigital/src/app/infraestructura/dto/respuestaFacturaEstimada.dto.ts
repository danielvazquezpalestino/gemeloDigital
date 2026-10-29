/**
 * DTO de una línea del desglose de una factura estimada.
 */
export interface lineaFacturaEstimadaDto
{
    readonly concepto: string;
    readonly cantidadKwh: number;
    readonly precioKwh: number;
    readonly subtotal: number;
}

/**
 * DTO de una factura eléctrica estimada.
 */
export interface facturaEstimadaDto
{
    readonly tarifaCodigo: string;
    readonly tarifaNombre: string;
    readonly consumoKwh: number;
    readonly periodo: string;
    readonly moneda: string;
    readonly desglose: readonly lineaFacturaEstimadaDto[];
    readonly totalEstimado: number;
    readonly esDemostracion: boolean;
    readonly supuestos: readonly string[];
}

/**
 * DTO de la respuesta de `POST /api/v1/electricity/estimate-bill`.
 */
export interface respuestaFacturaEstimadaDto
{
    readonly mensaje: string;
    readonly factura: facturaEstimadaDto;
}
