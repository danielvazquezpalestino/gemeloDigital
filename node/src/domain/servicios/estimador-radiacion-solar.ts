import DtoConsultarRadiacion = require('../entities/dtos/solar/consultar-radiacion.dto');
import RadiacionSolar = require('../entities/radiacion-solar.entidad');

/**
 * Modelo de estimación de radiación solar para Puebla.
 *
 * El valor base es el promedio estatal (~5.2 kWh/m²/día). Cuando hay
 * coordenadas se aplica un ajuste suave por latitud: la radiación aumenta al
 * acercarse al ecuador. El modelo es deliberadamente conservador y no depende
 * de MySQL, de modo que el endpoint responde incluso sin base de datos.
 */
class EstimadorRadiacionSolar
{
    static readonly RADIACION_PROMEDIO_PUEBLA_KWH_M2_DIA = 5.2;
    static readonly LATITUD_PROMEDIO_PUEBLA = 19;
    static readonly GRADIENTE_POR_GRADO_LATITUD = 0.018;
    static readonly RADIACION_MINIMA_KWH_M2_DIA = 3.5;
    static readonly RADIACION_MAXIMA_KWH_M2_DIA = 7.5;

    estimar(ubicacion: DtoConsultarRadiacion | undefined): RadiacionSolar
    {
        if (ubicacion === undefined || ubicacion.latitud === null || ubicacion.longitud === null)
        {
            return new RadiacionSolar(
                ubicacion?.latitud ?? null,
                ubicacion?.longitud ?? null,
                ubicacion?.municipioId ?? null,
                EstimadorRadiacionSolar.RADIACION_PROMEDIO_PUEBLA_KWH_M2_DIA,
                true,
                'PROMEDIO_PUEBLA',
            );
        }

        const ajuste = (EstimadorRadiacionSolar.LATITUD_PROMEDIO_PUEBLA - Math.abs(ubicacion.latitud))
            * EstimadorRadiacionSolar.GRADIENTE_POR_GRADO_LATITUD;
        const estimado = EstimadorRadiacionSolar.redondear(
            EstimadorRadiacionSolar.limitar(
                EstimadorRadiacionSolar.RADIACION_PROMEDIO_PUEBLA_KWH_M2_DIA + ajuste,
                EstimadorRadiacionSolar.RADIACION_MINIMA_KWH_M2_DIA,
                EstimadorRadiacionSolar.RADIACION_MAXIMA_KWH_M2_DIA,
            ),
        );

        return new RadiacionSolar(
            ubicacion.latitud,
            ubicacion.longitud,
            ubicacion.municipioId,
            estimado,
            true,
            'ESTIMACION_COORDENADAS',
        );
    }

    private static limitar(valor: number, minimo: number, maximo: number): number
    {
        return Math.min(maximo, Math.max(minimo, valor));
    }

    private static redondear(valor: number): number
    {
        return Math.round((valor + Number.EPSILON) * 100) / 100;
    }
}

export = EstimadorRadiacionSolar;
