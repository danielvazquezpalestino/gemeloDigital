import DtoCalcularProduccion = require('../entities/dtos/solar/calcular-produccion.dto');
import DtoConsultarRadiacion = require('../entities/dtos/solar/consultar-radiacion.dto');
import RadiacionSolar = require('../entities/radiacion-solar.entidad');
import ResultadoProduccionSolar = require('../entities/resultado-produccion-solar.entidad');

abstract class RepositorioSolar
{
    abstract obtenerRadiacion(dto: DtoConsultarRadiacion): Promise<RadiacionSolar>;

    abstract calcularProduccion(dto: DtoCalcularProduccion): Promise<ResultadoProduccionSolar>;
}

export = RepositorioSolar;
