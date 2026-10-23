/**
 * Producción solar estimada a partir de la capacidad instalada y la radiación.
 *
 * La eficiencia representa el rendimiento global del sistema (pérdidas por
 * inversor, cableado, temperatura y suciedad).
 */
class ResultadoProduccionSolar
{
    constructor(
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

export = ResultadoProduccionSolar;
