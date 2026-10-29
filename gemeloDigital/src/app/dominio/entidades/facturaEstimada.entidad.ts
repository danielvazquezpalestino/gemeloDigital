import { lineaFacturaEstimada } from './lineaFacturaEstimada.entidad';
import { periodoFacturacion } from '../objetosValor/periodoFacturacion';

/**
 * Factura eléctrica estimada con su desglose y supuestos.
 */
export class facturaEstimada
{
    constructor
    (
        public readonly tarifaCodigo: string,
        public readonly tarifaNombre: string,
        public readonly consumoKwh: number,
        public readonly periodo: periodoFacturacion,
        public readonly moneda: string,
        public readonly desglose: readonly lineaFacturaEstimada[],
        public readonly totalEstimado: number,
        public readonly esDemostracion: boolean,
        public readonly supuestos: readonly string[],
    )
    {
    }
}
