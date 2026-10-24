import EstadoEvaluacion = require('./estado-evaluacion');
import Incentivo = require('./incentivo.entidad');
import RequisitoIncentivo = require('./requisito-incentivo.entidad');

/**
 * Resultado de la evaluación de elegibilidad de un programa de incentivos.
 *
 * - `requisitosCumplidos` registra los requisitos que el solicitante sí
 *   cumplió según la documentación disponible.
 * - `requisitosPendientes` registra los requisitos que faltan por verificar.
 * - `datosFaltantes` lista los datos del solicitante que no alcanzan para
 *   despejar la evaluación.
 * - `explicacion` resume, en lenguaje natural, el motivo del resultado.
 */
class EvaluacionIncentivo
{
    constructor
    (
        public readonly incentivo: Incentivo,
        public readonly estado: EstadoEvaluacion,
        public readonly requisitosCumplidos: readonly RequisitoIncentivo[],
        public readonly requisitosPendientes: readonly RequisitoIncentivo[],
        public readonly datosFaltantes: readonly string[],
        public readonly explicacion: string,
    )
    {
    }
}

export = EvaluacionIncentivo;
