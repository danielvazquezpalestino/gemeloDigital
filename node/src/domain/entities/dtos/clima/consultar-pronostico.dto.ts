import Validacion = require('../validacion');

/**
 * Parámetros de consulta para el pronóstico meteorológico.
 *
 * - `latitude` y `longitude` son las coordenadas geográficas (WGS84).
 * - `days` es la cantidad de días solicitados (por defecto 7, máximo admitido
 *   por el proveedor).
 */
class DtoConsultarPronostico
{
    private constructor
    (
        public readonly latitude: number,
        public readonly longitude: number,
        public readonly dias: number,
    )
    {
    }

    static crear(consulta: unknown): [string | undefined, DtoConsultarPronostico | undefined]
    {
        const objeto = Validacion.comoObjeto(consulta);

        if (!objeto)
        {
            return ['Los parámetros de consulta son inválidos', undefined];
        }

        const [errorLatitud, latitude] = Validacion.leerNumeroEnRango(objeto['latitude'], 'latitude', -90, 90, undefined);

        if (errorLatitud || latitude === undefined)
        {
            return [errorLatitud ?? 'El parámetro "latitude" es obligatorio y debe ser una latitud entre -90 y 90', undefined];
        }

        const [errorLongitud, longitude] = Validacion.leerNumeroEnRango(objeto['longitude'], 'longitude', -180, 180, undefined);

        if (errorLongitud || longitude === undefined)
        {
            return [errorLongitud ?? 'El parámetro "longitude" es obligatorio y debe ser una longitud entre -180 y 180', undefined];
        }

        const [errorDias, dias] = Validacion.leerEnteroConsulta(objeto['days'], 'days', 7, 16);

        if (errorDias || dias === undefined)
        {
            return [errorDias ?? 'El parámetro "days" es inválido', undefined];
        }

        return [undefined, new DtoConsultarPronostico(latitude, longitude, dias)];
    }
}

export = DtoConsultarPronostico;
