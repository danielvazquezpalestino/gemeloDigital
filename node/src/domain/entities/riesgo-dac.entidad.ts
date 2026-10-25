import TipoTarifa = require('./tipo-tarifa');

/**
 * Evalúa el nivel de riesgo de caer en la tarifa DAC.
 *
 * `puedeDeterminarse` es `false` cuando no hay suficiente historial o no hay
 * umbral configurado. En ese caso `nivelRiesgo` vale `INDETERMINADO`.
 */
class EvaluacionRiesgoDac
{
    constructor(
        public readonly nivelRiesgo: string,
        public readonly tipoTarifa: TipoTarifa,
        public readonly puedeDeterminarse: boolean,
        public readonly motivo: string,
        public readonly consumoPromedioMensualKwh: number,
        public readonly mesesHistoricos: number,
        public readonly umbralMensualKwh: number | null,
        public readonly indiceSobreUmbral: number | null,
        public readonly esDemostracion: boolean,
        public readonly determinacionOficial: boolean,
        public readonly advertencias: readonly string[],
    )
    {
    }
}

export = EvaluacionRiesgoDac;
