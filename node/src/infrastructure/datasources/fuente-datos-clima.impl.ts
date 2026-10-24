import ErrorPersonalizado = require('../../domain/datasources/errors/custom-error');
import FuenteDatosClima = require('../../domain/datasources/fuente-datos-clima');
import Pronostico = require('../../domain/entities/pronostico.entidad');
import RegistroMeteorologico = require('../../domain/entities/registro-meteorologico.entidad');

/**
 * Implementación de la fuente de datos meteorológica con el proveedor
 * Open-Meteo.
 *
 * Es la única capa que conoce el proveedor externo: el resto de la API solo
 * conoce el puerto `FuenteDatosClima`. Los datos se normalizan al formato
 * propio de la API antes de ser entregados.
 */
class FuenteDatosClimaImpl implements FuenteDatosClima
{
    private static readonly PROVEEDOR = 'Open-Meteo';
    private static readonly URL_BASE = 'https://api.open-meteo.com/v1/forecast';
    private static readonly TIEMPO_MAXIMO_MS = 10000;

    async obtenerPronostico(latitud: number, longitud: number, dias: number): Promise<Pronostico>
    {
        try
        {
            const datos = await this.consultarProveedor(latitud, longitud, dias);

            const registros = FuenteDatosClimaImpl.normalizar(datos, dias);
            const zonaHoraria = typeof datos['timezone'] === 'string' ? datos['timezone'] : 'UTC';

            return new Pronostico(
                FuenteDatosClimaImpl.PROVEEDOR,
                latitud,
                longitud,
                dias,
                zonaHoraria,
                new Date(),
                registros,
            );
        }
        catch (error)
        {
            throw FuenteDatosClimaImpl.traducirError(error, 'No se pudo obtener el pronóstico meteorológico');
        }
    }

    /**
     * Consulta el pronóstico al proveedor con los parámetros de ubicación y
     * ventana de tiempo, aplicando un tiempo de espera máximo.
     */
    private async consultarProveedor(latitud: number, longitud: number, dias: number): Promise<Record<string, unknown>>
    {
        const controlador = new AbortController();
        const tiempo = setTimeout(() => controlador.abort(), FuenteDatosClimaImpl.TIEMPO_MAXIMO_MS);

        try
        {
            const respuesta = await fetch
            (
                `${FuenteDatosClimaImpl.URL_BASE}?latitude=${latitud}&longitude=${longitud}` +
                `&current=temperature_2m,relative_humidity_2m,is_day,precipitation,shortwave_radiation,weather_code` +
                `&hourly=temperature_2m,relative_humidity_2m,is_day,precipitation,shortwave_radiation,cloud_cover` +
                `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,shortwave_radiation_sum,weather_code` +
                `&timezone=auto&forecast_days=${dias}` +
                `&temperature_unit=celsius&precipitation_unit=mm&wind_speed_unit=kmh`,
                { signal: controlador.signal },
            );

            if (!respuesta.ok)
            {
                throw new Error(`El proveedor meteorológico respondió con el código ${respuesta.status}`);
            }

            const datos: Record<string, unknown> = await respuesta.json();
            return datos;
        }
        finally
        {
            clearTimeout(tiempo);
        }
    }

    /**
     * Normaliza la respuesta del proveedor al formato estable de la API.
     *
     * Para cada día de la ventana se entregan la temperatura media, la
     * nubosidad, la precipitación y la radiación solar cuando el proveedor las
     * reporta.
     */
    private static normalizar(datos: Record<string, unknown>, dias: number): RegistroMeteorologico[]
    {
        const horario = FuenteDatosClimaImpl.leerBloque(datos, 'hourly') as
        {
            time?: string[];
            cloud_cover?: number[];
        }
        | undefined;

        const diario = FuenteDatosClimaImpl.leerBloque(datos, 'daily') as
        {
            time?: string[];
            temperature_2m_max?: number[];
            temperature_2m_min?: number[];
            precipitation_sum?: number[];
            shortwave_radiation_sum?: number[];
        }
        | undefined;

        const registros: RegistroMeteorologico[] = [];
        const totalDias = Math.min(dias, diario?.['time']?.length ?? 0);

        for (let i = 0; i < totalDias; i++)
        {
            const fecha = diario?.['time']?.[i];

            if (!fecha)
            {
                break;
            }

            const maxima = diario?.['temperature_2m_max']?.[i];
            const minima = diario?.['temperature_2m_min']?.[i];
            const temperatura = maxima !== undefined && minima !== undefined ? (maxima + minima) / 2 : null;

            registros.push(
                new RegistroMeteorologico(
                    new Date(`${fecha}T00:00:00.000Z`),
                    temperatura,
                    FuenteDatosClimaImpl.nubosidadDelDia(horario, fecha),
                    diario?.['precipitation_sum']?.[i] ?? 0,
                    FuenteDatosClimaImpl.radiacionSolarDelDia(diario, i),
                ),
            );
        }

        return registros;
    }

    private static nubosidadDelDia(horario: { time?: string[]; cloud_cover?: number[] } | undefined, fecha: string): number | null
    {
        const dia = fecha.substring(0, 10);

        let suma = 0;
        let cantidad = 0;

        for (let i = 0; i < (horario?.['time']?.length ?? 0); i++)
        {
            const hora = horario?.['time']?.[i];

            if (hora === undefined || !hora.startsWith(dia))
            {
                continue;
            }

            const nubosidad = horario?.['cloud_cover']?.[i];

            if (nubosidad === undefined)
            {
                continue;
            }

            suma += nubosidad;
            cantidad += 1;
        }

        return cantidad > 0 ? Math.round((suma / cantidad) * 100) / 100 : null;
    }

    private static radiacionSolarDelDia(diario: { time?: string[]; shortwave_radiation_sum?: number[] } | undefined, indice: number): number | null
    {
        const suma = diario?.['shortwave_radiation_sum']?.[indice];

        if (suma === undefined)
        {
            return null;
        }

        // El proveedor entrega la radiación en megajulios por metro cuadrado y
        // el promedio diario se expresa en vatios por metro cuadrado.
        const radiacion = suma * 1000000 / (24 * 3600);

        return Math.round(radiacion * 100) / 100;
    }

    private static leerBloque(datos: Record<string, unknown>, clave: string): unknown
    {
        const bloque = datos[clave];

        if (typeof bloque !== 'object' || bloque === null)
        {
            return {};
        }

        return bloque;
    }

    private static traducirError(error: unknown, mensajeGenerico: string): ErrorPersonalizado
    {
        if (error instanceof ErrorPersonalizado)
        {
            return error;
        }

        console.error('Error al obtener el pronóstico meteorológico:', error);

        return ErrorPersonalizado.errorInterno(mensajeGenerico);
    }
}

export = FuenteDatosClimaImpl;
