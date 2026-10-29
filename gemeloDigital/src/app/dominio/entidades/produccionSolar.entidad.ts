/**
 * Producción solar estimada para una capacidad instalada.
 */
export class produccionSolar
{
    constructor
    (
        public readonly capacidadKwp: number,
        public readonly eficiencia: number,
        public readonly radiacionKwhM2Dia: number,
        public readonly produccionMensualKwh: number,
        public readonly produccionAnualKwh: number,
        public readonly esEstimacion: boolean,
        public readonly fuenteRadiacion: string,
    )
    {
    }
}
