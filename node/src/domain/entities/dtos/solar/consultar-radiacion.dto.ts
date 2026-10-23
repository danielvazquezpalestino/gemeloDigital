import ValidacionEntrada = require('../validacion-entrada');

/**
 * Datos de ubicación para consultar la radiación solar.
 *
 * Se acepta un par de coordenadas completo o, en su lugar, un municipio.
 * Enviar solo una de las dos coordenadas es un error porque produciría una
 * ubicación ambigua.
 */
class DtoConsultarRadiacion
{
    private constructor(
        public readonly latitud: number | null,
        public readonly longitud: number | null,
        public readonly municipioId: number | null,
    )
    {
    }

    static crear(consulta: unknown): [string | undefined, DtoConsultarRadiacion | undefined]
    {
        const objeto = ValidacionEntrada.comoObjeto(consulta);

        if (!objeto)
        {
            return ['Los parámetros de ubicación son inválidos', undefined];
        }

        const valorLatitud = objeto['latitud'];
        const valorLongitud = objeto['longitud'];
        const valorMunicipio = objeto['municipioId'];

        const tieneLatitud = valorLatitud !== undefined && valorLatitud !== null && valorLatitud !== '';
        const tieneLongitud = valorLongitud !== undefined && valorLongitud !== null && valorLongitud !== '';
        const tieneMunicipio = valorMunicipio !== undefined && valorMunicipio !== null && valorMunicipio !== '';

        let latitud: number | undefined;
        let longitud: number | undefined;
        let municipioId: number | undefined;

        if (tieneLatitud)
        {
            const [error, valor] = ValidacionEntrada.leerNumeroConsulta(
                valorLatitud,
                'latitud',
                { minimo: -90, maximo: 90 },
            );

            if (error || valor === undefined)
            {
                return [error ?? 'La latitud es inválida', undefined];
            }

            latitud = valor;
        }

        if (tieneLongitud)
        {
            const [error, valor] = ValidacionEntrada.leerNumeroConsulta(
                valorLongitud,
                'longitud',
                { minimo: -180, maximo: 180 },
            );

            if (error || valor === undefined)
            {
                return [error ?? 'La longitud es inválida', undefined];
            }

            longitud = valor;
        }

        if (tieneLatitud !== tieneLongitud)
        {
            return ['Debe enviar "latitud" y "longitud" juntos, o bien "municipioId"', undefined];
        }

        if (tieneMunicipio)
        {
            const [error, valor] = ValidacionEntrada.leerNumeroConsulta(
                valorMunicipio,
                'municipioId',
                { minimo: 1, maximo: 100000, entero: true },
            );

            if (error || valor === undefined)
            {
                return [error ?? 'El municipio es inválido', undefined];
            }

            municipioId = valor;
        }

        if (!tieneLatitud && !tieneMunicipio)
        {
            return ['Debe indicar "latitud" y "longitud", o bien "municipioId"', undefined];
        }

        return [undefined, new DtoConsultarRadiacion(latitud ?? null, longitud ?? null, municipioId ?? null)];
    }
}

export = DtoConsultarRadiacion;
