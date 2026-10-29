import { estadoEvaluacionIncentivo } from '../objetosValor/estadoEvaluacionIncentivo';
import { incentivo } from './incentivo.entidad';
import { requisitoIncentivo } from './requisitoIncentivo.entidad';

/**
 * Evaluación de elegibilidad de un incentivo concreto.
 */
export class evaluacionIncentivo
{
    constructor
    (
        public readonly incentivoEvaluado: incentivo,
        public readonly estado: estadoEvaluacionIncentivo,
        public readonly requisitosCumplidos: readonly requisitoIncentivo[],
        public readonly requisitosPendientes: readonly requisitoIncentivo[],
        public readonly datosFaltantes: readonly string[],
        public readonly explicacion: string,
    )
    {
    }
}
