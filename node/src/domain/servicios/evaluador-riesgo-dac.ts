import EvaluacionRiesgoDac = require('../entities/riesgo-dac.entidad');
import TipoTarifa = require('../entities/tipo-tarifa');

/**
 * Evaluador de riesgo DAC basado en una regla de DEMOSTRACIÓN.
 *
 * No se usan umbrales oficiales porque el proyecto no contiene una fuente
 * verificada. El umbral está aislado aquí para poder reemplazarlo cuando se
 * configure la regla real.
 */
class EvaluadorRiesgoDac
{
    static readonly UMBRAL_DEMO_KWH_MENSUAL = 2500;
    static readonly MESES_MINIMOS_DEMO = 6;

    evaluar(
        consumoPromedioMensualKwh: number,
        mesesHistoricos: number,
        tipoTarifa: TipoTarifa,
    ): EvaluacionRiesgoDac
    {
        const advertencias = [
            'La regla aplicada es una DEMOSTRACIÓN y no un criterio oficial de la CFE.',
            'El resultado no constituye una determinación oficial de cambio de tarifa.',
        ];

        if (tipoTarifa === TipoTarifa.DAC)
        {
            advertencias.push(
                'El consumo ya corresponde a la tarifa DAC; el nivel de riesgo se muestra solo como referencia.',
            );
        }

        if (mesesHistoricos < EvaluadorRiesgoDac.MESES_MINIMOS_DEMO)
        {
            return new EvaluacionRiesgoDac(
                'INDETERMINADO',
                tipoTarifa,
                false,
                `Se requieren al menos ${EvaluadorRiesgoDac.MESES_MINIMOS_DEMO} meses de historial para aplicar la regla de demostración.`,
                EvaluadorRiesgoDac.redondear(consumoPromedioMensualKwh),
                mesesHistoricos,
                EvaluadorRiesgoDac.UMBRAL_DEMO_KWH_MENSUAL,
                null,
                true,
                false,
                advertencias,
            );
        }

        const indice = consumoPromedioMensualKwh / EvaluadorRiesgoDac.UMBRAL_DEMO_KWH_MENSUAL;
        let nivelRiesgo = 'BAJO';
        let motivo = 'El consumo promedio está por debajo del 80 % del umbral de demostración.';

        if (indice >= 1)
        {
            nivelRiesgo = 'ALTO';
            motivo = 'El consumo promedio alcanza o supera el umbral mensual de demostración.';
        }
        else if (indice >= 0.8)
        {
            nivelRiesgo = 'MEDIO';
            motivo = 'El consumo promedio está entre el 80 % y el 100 % del umbral de demostración.';
        }

        return new EvaluacionRiesgoDac(
            nivelRiesgo,
            tipoTarifa,
            true,
            motivo,
            EvaluadorRiesgoDac.redondear(consumoPromedioMensualKwh),
            mesesHistoricos,
            EvaluadorRiesgoDac.UMBRAL_DEMO_KWH_MENSUAL,
            EvaluadorRiesgoDac.redondear(indice),
            true,
            false,
            advertencias,
        );
    }

    private static redondear(valor: number): number
    {
        return Math.round((valor + Number.EPSILON) * 100) / 100;
    }
}

export = EvaluadorRiesgoDac;
