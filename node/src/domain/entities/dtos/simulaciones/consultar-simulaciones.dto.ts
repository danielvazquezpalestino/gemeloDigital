import ValidacionSimulacion = require('./validacion-simulacion');

/**
 * Parámetros de consulta del historial de simulaciones.
 *
 * `municipioId` filtra por municipio; `pagina` y `limite` controlan la
 * paginación (por defecto 1 y 20, con un máximo de 100 registros por página).
 */
class DtoConsultarSimulaciones
{
    private constructor
    (
        public readonly municipioId: number | undefined,
        public readonly pagina: number,
        public readonly limite: number,
    )
    {
    }

    static crear(consulta: unknown): [string | undefined, DtoConsultarSimulaciones | undefined]
    {
        const objeto = ValidacionSimulacion.comoObjeto(consulta);

        if (!objeto)
        {
            return ['Los parámetros de consulta son inválidos', undefined];
        }

        let municipioId: number | undefined;

        if (objeto['municipioId'] !== undefined && objeto['municipioId'] !== null && objeto['municipioId'] !== '')
        {
            const [error, valor] = ValidacionSimulacion.leerEnteroConsulta(objeto['municipioId'], 'municipioId', 1, ValidacionSimulacion.MUNICIPIO_MAXIMO);

            if (error || valor === undefined)
            {
                return [error ?? 'El parámetro "municipioId" es inválido', undefined];
            }

            municipioId = valor;
        }

        const [errorPagina, pagina] = ValidacionSimulacion.leerEnteroConsulta(objeto['pagina'], 'pagina', 1, ValidacionSimulacion.MUNICIPIO_MAXIMO);

        if (errorPagina || pagina === undefined)
        {
            return [errorPagina ?? 'El parámetro "pagina" es inválido', undefined];
        }

        const [errorLimite, limite] = ValidacionSimulacion.leerEnteroConsulta(objeto['limite'], 'limite', 20, ValidacionSimulacion.LIMITE_MAXIMO_REGISTROS);

        if (errorLimite || limite === undefined)
        {
            return [errorLimite ?? 'El parámetro "limite" es inválido', undefined];
        }

        return [undefined, new DtoConsultarSimulaciones(municipioId, pagina, limite)];
    }
}

export = DtoConsultarSimulaciones;
