import DtoConsultarRadiacion = require('../entities/dtos/solar/consultar-radiacion.dto');
import RadiacionSolar = require('../entities/radiacion-solar.entidad');

abstract class FuenteDatosSolar
{
    abstract obtenerRadiacion(ubicacion: DtoConsultarRadiacion | undefined): Promise<RadiacionSolar>;
}

export = FuenteDatosSolar;
