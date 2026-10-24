import Pronostico = require('../entities/pronostico.entidad');

/**
 * Puerto (contrato) de obtención de pronósticos meteorológicos.
 * La implementación concreta vive en `infrastructure/datasources`.
 */
abstract class FuenteDatosClima
{
    abstract obtenerPronostico(latitud: number, longitud: number, dias: number): Promise<Pronostico>;
}

export = FuenteDatosClima;
