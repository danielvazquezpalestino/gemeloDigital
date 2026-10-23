import DtoEstimarFactura = require('../entities/dtos/electricidad/estimar-factura.dto');
import DtoRiesgoDac = require('../entities/dtos/electricidad/riesgo-dac.dto');
import EvaluacionRiesgoDac = require('../entities/riesgo-dac.entidad');
import FacturaEstimada = require('../entities/factura-estimada.entidad');
import TarifaElectrica = require('../entities/tarifa-electrica.entidad');

abstract class RepositorioElectricidad
{
    abstract listarTarifas(): Promise<TarifaElectrica[]>;

    abstract estimarFactura(dto: DtoEstimarFactura): Promise<FacturaEstimada>;

    abstract evaluarRiesgoDac(dto: DtoRiesgoDac): Promise<EvaluacionRiesgoDac>;
}

export = RepositorioElectricidad;
