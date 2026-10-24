import Validacion = require('../validacion');

/**
 * Parámetros de consulta para las estadísticas agregadas por municipio.
 *
 * - `municipality` es el identificador del municipio a analizar.
 * - `period` es el periodo de análisis en días; si la base de datos no cuenta
 *   con fechas suficientes se ignorará el filtro.
 */
class DtoConsultarEstadisticas
{
    private constructor
    (
        public readonly municipality: number | null,
        public readonly period: number | null,
    )
    {
    }

    static crear(consulta: unknown): [string | undefined, DtoConsultarEstadisticas | undefined]
    {
        const objeto = Validacion.comoObjeto(consulta);

        if (!objeto)
        {
            return ['Los parámetros de consulta son inválidos', undefined];
        }

        let municipality: number | null = null;

        if (objeto['municipality'] !== undefined && objeto['municipality'] !== null && objeto['municipality'] !== '')
        {
            const [errorMunicipio, valor] = Validacion.leerEnteroConsulta(objeto['municipality'], 'municipality', undefined, Validacion.MAXIMO_ID_MUNICIPIO);

            if (errorMunicipio || valor === undefined)
            {
                return [errorMunicipio ?? 'El parámetro "municipality" es inválido', undefined];
            }

            municipality = valor;
        }

        let period: number | null = null;

        if (objeto['period'] !== undefined && objeto['period'] !== null && objeto['period'] !== '')
        {
            const [errorPeriod, valor] = Validacion.leerEnteroConsulta(objeto['period'], 'period', undefined, 3650);

            if (errorPeriod || valor === undefined)
            {
                return [errorPeriod ?? 'El parámetro "period" es inválido', undefined];
            }

            period = valor;
        }

        return [undefined, new DtoConsultarEstadisticas(municipality, period)];
    }
}

export = DtoConsultarEstadisticas;
