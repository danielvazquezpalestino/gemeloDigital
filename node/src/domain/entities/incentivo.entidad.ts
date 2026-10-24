import BeneficioIncentivo = require('./beneficio-incentivo.entidad');
import EstadoIncentivo = require('./estado-incentivo');
import RequisitoIncentivo = require('./requisito-incentivo.entidad');

/**
 * Programa de incentivos para la generación distribuida y la instalación
 * de sistemas solares fotovoltaicos.
 *
 * Los datos de vigencia (`vigenciaDesde` / `vigenciaHasta`) y el organismo
 * responsable son los que maneja la fuente de datos; el estado operativo se
 * deriva a partir de la verificación de los requisitos y de las fechas.
 * `municipioId` es la clave INEGI del municipio al que aplica el programa
 * (puede ser nula para programas del nivel estatal).
 */
class Incentivo
{
    constructor
    (
        public readonly id: number,
        public readonly programa: string,
        public readonly nombre: string,
        public readonly descripcion: string,
        public readonly beneficiarios: readonly string[],
        public readonly municipioId: number | null,
        public readonly requisitos: readonly RequisitoIncentivo[],
        public readonly beneficios: readonly BeneficioIncentivo[],
        public readonly vigenciaDesde: Date | null,
        public readonly vigenciaHasta: Date | null,
        public readonly organismoResponsable: string | null,
        public readonly fuenteOficial: string | null,
        public readonly verificado: boolean,
    )
    {
    }

    /**
     * Determina el estado vigencia del programa a partir de la fecha actual.
     */
    obtenerEstado(ahora: Date = new Date()): EstadoIncentivo
    {
        if (!this.verificado)
        {
            return EstadoIncentivo.NO_VERIFICADO;
        }

        if (this.vigenciaHasta !== null && ahora > this.vigenciaHasta)
        {
            return EstadoIncentivo.VENCIDO;
        }

        if (this.vigenciaDesde !== null && ahora < this.vigenciaDesde)
        {
            return EstadoIncentivo.PROXIMO;
        }

        return EstadoIncentivo.ACTIVO;
    }
}

export = Incentivo;
