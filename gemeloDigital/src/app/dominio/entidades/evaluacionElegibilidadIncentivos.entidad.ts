import { evaluacionIncentivo } from './evaluacionIncentivo.entidad';
import { tipoBeneficiario } from '../objetosValor/tipoBeneficiario';

/**
 * Resultado de evaluar la elegibilidad de todos los incentivos registrados.
 */
export class evaluacionElegibilidadIncentivos
{
    constructor
    (
        public readonly tipoBeneficiario: tipoBeneficiario,
        public readonly municipio: string,
        public readonly capacidadSistemaKw: number | null,
        public readonly tipoInstalacion: string | null,
        public readonly fechaEvaluacion: Date,
        public readonly evaluaciones: readonly evaluacionIncentivo[],
    )
    {
    }
}
