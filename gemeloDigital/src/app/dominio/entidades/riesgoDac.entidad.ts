import { nivelRiesgoDac } from '../objetosValor/nivelRiesgoDac';
import { tipoTarifa } from '../objetosValor/tipoTarifa';

/**
 * Evaluación del riesgo de que un usuario caiga en la tarifa DAC.
 */
export class riesgoDac
{
    constructor
    (
        public readonly nivelRiesgo: nivelRiesgoDac,
        public readonly tipoTarifa: tipoTarifa,
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
