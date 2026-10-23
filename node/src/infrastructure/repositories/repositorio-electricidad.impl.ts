import CalculadoraFacturaElectrica = require('../../domain/servicios/calculadora-factura-electrica');
import CustomError = require('../../domain/datasources/errors/custom.error');
import DtoEstimarFactura = require('../../domain/entities/dtos/electricidad/estimar-factura.dto');
import DtoRiesgoDac = require('../../domain/entities/dtos/electricidad/riesgo-dac.dto');
import EvaluacionRiesgoDac = require('../../domain/entities/riesgo-dac.entidad');
import EvaluadorRiesgoDac = require('../../domain/servicios/evaluador-riesgo-dac');
import FacturaEstimada = require('../../domain/entities/factura-estimada.entidad');
import FuenteDatosElectricidad = require('../../domain/datasources/fuente-datos-electricidad');
import RepositorioElectricidad = require('../../domain/repositories/repositorio-electricidad');
import TarifaElectrica = require('../../domain/entities/tarifa-electrica.entidad');

class RepositorioElectricidadImpl implements RepositorioElectricidad
{
    constructor(
        private readonly fuenteDatos: FuenteDatosElectricidad,
        private readonly calculadoraFactura: CalculadoraFacturaElectrica,
        private readonly evaluadorRiesgo: EvaluadorRiesgoDac,
    )
    {
    }

    listarTarifas(): Promise<TarifaElectrica[]>
    {
        return this.fuenteDatos.listarTarifas();
    }

    async estimarFactura(dto: DtoEstimarFactura): Promise<FacturaEstimada>
    {
        const tarifa = await this.fuenteDatos.buscarTarifa(dto.tipoTarifa);

        if (!tarifa)
        {
            throw CustomError.notFound(`La tarifa "${dto.tipoTarifa}" no existe en el catálogo configurado`);
        }

        return this.calculadoraFactura.calcular(tarifa, dto.consumoKwh, dto.periodo);
    }

    async evaluarRiesgoDac(dto: DtoRiesgoDac): Promise<EvaluacionRiesgoDac>
    {
        return this.evaluadorRiesgo.evaluar(
            dto.consumoPromedioMensualKwh,
            dto.mesesHistoricos,
            dto.tipoTarifa,
        );
    }
}

export = RepositorioElectricidadImpl;
