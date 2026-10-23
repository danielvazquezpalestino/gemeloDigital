import DtoConsultarRadiacion = require('./consultar-radiacion.dto');
import ValidacionEntrada = require('../validacion-entrada');

/**
 * Datos de entrada para estimar la producción solar.
 *
 * La ubicación es opcional: si no se envía, el modelo usa el promedio de
 * Puebla. La eficiencia se expresa como fracción (0 a 1) y por defecto es 0.80.
 */
class DtoCalcularProduccion
{
    private constructor(
        public readonly capacidadKwp: number,
        public readonly eficiencia: number,
        public readonly ubicacion: DtoConsultarRadiacion | undefined,
    )
    {
    }

    static crear(consulta: unknown): [string | undefined, DtoCalcularProduccion | undefined]
    {
        const objeto = ValidacionEntrada.comoObjeto(consulta);

        if (!objeto)
        {
            return ['Los parámetros de producción son inválidos', undefined];
        }

        const [errorCapacidad, capacidadKwp] = ValidacionEntrada.leerNumeroConsulta(
            objeto['capacidadKwp'],
            'capacidadKwp',
            { minimo: 0, maximo: 100000, incluirMinimo: false },
        );

        if (errorCapacidad || capacidadKwp === undefined)
        {
            return [errorCapacidad, undefined];
        }

        const [errorEficiencia, eficiencia] = ValidacionEntrada.leerNumeroConsulta(
            objeto['eficiencia'],
            'eficiencia',
            { minimo: 0, maximo: 1, porDefecto: 0.80, incluirMinimo: false },
        );

        if (errorEficiencia || eficiencia === undefined)
        {
            return [errorEficiencia, undefined];
        }

        const valorLatitud = objeto['latitud'];
        const valorLongitud = objeto['longitud'];
        const valorMunicipio = objeto['municipioId'];

        const tieneUbicacion =
            (valorLatitud !== undefined && valorLatitud !== null && valorLatitud !== '') ||
            (valorLongitud !== undefined && valorLongitud !== null && valorLongitud !== '') ||
            (valorMunicipio !== undefined && valorMunicipio !== null && valorMunicipio !== '');

        let ubicacion: DtoConsultarRadiacion | undefined;

        if (tieneUbicacion)
        {
            const [errorUbicacion, dtoUbicacion] = DtoConsultarRadiacion.crear(objeto);

            if (errorUbicacion || !dtoUbicacion)
            {
                return [errorUbicacion ?? 'La ubicación es inválida', undefined];
            }

            ubicacion = dtoUbicacion;
        }

        return [undefined, new DtoCalcularProduccion(capacidadKwp, eficiencia, ubicacion)];
    }
}

export = DtoCalcularProduccion;
