import { beneficioIncentivo } from './beneficioIncentivo.entidad';
import { requisitoIncentivo } from './requisitoIncentivo.entidad';

/**
 * Programa de incentivos para la generación distribuida.
 */
export class incentivo
{
    constructor
    (
        public readonly id: number,
        public readonly programa: string,
        public readonly nombre: string,
        public readonly descripcion: string,
        public readonly beneficiarios: readonly string[],
        public readonly municipioId: number | null,
        public readonly requisitos: readonly requisitoIncentivo[],
        public readonly beneficios: readonly beneficioIncentivo[],
        public readonly vigenciaDesde: Date | null,
        public readonly vigenciaHasta: Date | null,
        public readonly organismoResponsable: string | null,
        public readonly fuenteOficial: string | null,
        public readonly verificado: boolean,
    )
    {
    }
}
