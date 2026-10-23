import DtoConsultarRadiacion = require('../../domain/entities/dtos/solar/consultar-radiacion.dto');
import EstimadorRadiacionSolar = require('../../domain/servicios/estimador-radiacion-solar');
import FuenteDatosSolar = require('../../domain/datasources/fuente-datos-solar');
import RadiacionSolar = require('../../domain/entities/radiacion-solar.entidad');

/**
 * Fuente de datos de radiación solar.
 *
 * Por ahora la estimación es local y determinista para garantizar que el
 * endpoint responda aunque MySQL no esté disponible. Si más adelante se agrega
 * una tabla de radiación, esta es la única clase que debe cambiar.
 */
class FuenteDatosSolarImpl extends FuenteDatosSolar
{
    constructor(private readonly estimadorRadiacion: EstimadorRadiacionSolar)
    {
        super();
    }

    async obtenerRadiacion(ubicacion: DtoConsultarRadiacion | undefined): Promise<RadiacionSolar>
    {
        return this.estimadorRadiacion.estimar(ubicacion);
    }
}

export = FuenteDatosSolarImpl;
