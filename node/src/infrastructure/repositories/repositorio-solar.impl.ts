import CalculadoraSimulacionSolar = require('../../domain/servicios/calculadora-simulacion-solar');
import DtoCalcularProduccion = require('../../domain/entities/dtos/solar/calcular-produccion.dto');
import DtoConsultarRadiacion = require('../../domain/entities/dtos/solar/consultar-radiacion.dto');
import FuenteDatosSolar = require('../../domain/datasources/fuente-datos-solar');
import RadiacionSolar = require('../../domain/entities/radiacion-solar.entidad');
import RepositorioSolar = require('../../domain/repositories/repositorio-solar');
import ResultadoProduccionSolar = require('../../domain/entities/resultado-produccion-solar.entidad');

class RepositorioSolarImpl implements RepositorioSolar
{
    constructor(
        private readonly fuenteDatos: FuenteDatosSolar,
        private readonly calculadoraSolar: CalculadoraSimulacionSolar,
    )
    {
    }

    obtenerRadiacion(dto: DtoConsultarRadiacion): Promise<RadiacionSolar>
    {
        return this.fuenteDatos.obtenerRadiacion(dto);
    }

    async calcularProduccion(dto: DtoCalcularProduccion): Promise<ResultadoProduccionSolar>
    {
        const radiacion = await this.fuenteDatos.obtenerRadiacion(dto.ubicacion);

        return this.calculadoraSolar.calcularProduccion(dto.capacidadKwp, radiacion, dto.eficiencia);
    }
}

export = RepositorioSolarImpl;
