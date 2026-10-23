import LineaFacturaEstimada = require('./linea-factura-estimada.entidad');

/**
 * Resultado transparente de una estimación de factura eléctrica.
 */
class FacturaEstimada
{
    constructor(
        public readonly tarifaCodigo: string,
        public readonly tarifaNombre: string,
        public readonly consumoKwh: number,
        public readonly moneda: string,
        public readonly desglose: readonly LineaFacturaEstimada[],
        public readonly totalEstimado: number,
        public readonly esDemostracion: boolean,
        public readonly supuestos: readonly string[],
    )
    {
    }
}

export = FacturaEstimada;
