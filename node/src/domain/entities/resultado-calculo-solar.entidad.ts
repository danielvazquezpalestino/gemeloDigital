/**
 * Resultado del modelo de cálculo solar.
 *
 * `advertencias` recoge los indicadores que el usuario debe conocer: el techo
 * no alcanza para los paneles requeridos, la producción no cubre el consumo
 * completo o se incluyen baterías que alargan el retorno de inversión.
 */
class ResultadoCalculoSolar
{
    constructor
    (
        public readonly panelesNecesarios: number,
        public readonly produccionAnual: number,
        public readonly ahorroEstimado: number,
        public readonly costoInversionTotal: number,
        public readonly retornoInversionAnios: number,
        public readonly advertencias: readonly string[],
    )
    {
    }
}

export = ResultadoCalculoSolar;
